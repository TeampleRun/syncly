'use server';

// 워크스페이스 삭제 서버액션 — owner면 멤버 수와 무관하게 실행 가능
// begin_workspace_deletion(선점) → mark_workspace_deletion_in_progress(reserved→deleting 전환, 이 시점부터
// 자동 만료 없음 + 신규 업로드 확실히 차단) → Storage 목록 조회·배치 삭제(목록이 빌 때까지 반복) →
// finalize_workspace_deletion(실제 DB 삭제) 순서로 진행한다. deleting 전환 이후에만 목록을 조회하므로 그
// 사이에 새 파일이 올라와 누락되는 일이 없다. workspace row와 owner 멤버십은 finalize 전까지 그대로
// 남아있어 일반 유저 세션으로도 Storage RLS를 그대로 통과하므로 admin 클라이언트가 필요 없다.
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createSupabaseServerClient } from '@/shared/api/supabase/server';

const WORKSPACE_RESOURCES_BUCKET = 'workspace-resources';
const STORAGE_LIST_PAGE_SIZE = 1000;

const DELETE_FAILED_MESSAGE = '워크스페이스 삭제에 실패했어요. 잠시 후 다시 시도해주세요.';

const deleteWorkspaceInputSchema = z.object({
  workspaceId: z.guid(),
});

export type DeleteWorkspaceInput = z.infer<typeof deleteWorkspaceInputSchema>;

type ServerSupabaseClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

// .list()는 한 번에 최대 1000개만 반환하므로, offset을 늘려가며 전체 파일 목록을 모은다.
async function listAllStorageFileNames(
  supabase: ServerSupabaseClient,
  workspaceId: string,
): Promise<string[]> {
  const names: string[] = [];
  let offset = 0;

  while (true) {
    const { data: page, error } = await supabase.storage
      .from(WORKSPACE_RESOURCES_BUCKET)
      .list(workspaceId, {
        limit: STORAGE_LIST_PAGE_SIZE,
        offset,
        sortBy: { column: 'name', order: 'asc' },
      });

    if (error) {
      throw error;
    }
    if (!page || page.length === 0) {
      break;
    }

    // id가 null인 항목은 폴더 placeholder라 remove() 대상이 아니다 — 업로드 경로가 항상 평면 구조라
    // 지금은 나타나지 않지만, 혹시 남아있으면 cleanupWorkspaceStorage의 while 루프가 끝나지 않으므로 걸러낸다.
    names.push(...page.filter((file) => file.id !== null).map((file) => file.name));

    if (page.length < STORAGE_LIST_PAGE_SIZE) {
      break;
    }
    offset += STORAGE_LIST_PAGE_SIZE;
  }

  return names;
}

async function removeStorageFiles(
  supabase: ServerSupabaseClient,
  workspaceId: string,
  fileNames: string[],
): Promise<void> {
  const paths = fileNames.map((name) => `${workspaceId}/${name}`);

  // remove()도 한 번에 최대 1000개까지만 처리되므로, list()와 동일한 크기로 나눠서 삭제한다.
  for (let index = 0; index < paths.length; index += STORAGE_LIST_PAGE_SIZE) {
    const batch = paths.slice(index, index + STORAGE_LIST_PAGE_SIZE);
    const { error } = await supabase.storage.from(WORKSPACE_RESOURCES_BUCKET).remove(batch);

    if (error) {
      throw error;
    }
  }
}

// deleting 전환 이후 신규 업로드는 막혀있지만, 혹시 남는 파일이 있을 수 있으니 목록이 빌 때까지
// 조회·삭제를 반복해 고아 파일 가능성을 줄인다.
async function cleanupWorkspaceStorage(
  supabase: ServerSupabaseClient,
  workspaceId: string,
): Promise<void> {
  while (true) {
    const fileNames = await listAllStorageFileNames(supabase, workspaceId);
    if (fileNames.length === 0) {
      break;
    }
    await removeStorageFiles(supabase, workspaceId, fileNames);
  }
}

export async function deleteWorkspace(input: DeleteWorkspaceInput): Promise<void> {
  const parsed = deleteWorkspaceInputSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error('입력값이 올바르지 않습니다');
  }

  const { workspaceId } = parsed.data;
  const supabase = await createSupabaseServerClient();

  const { data: token, error: beginError } = await supabase.rpc('begin_workspace_deletion', {
    p_workspace_id: workspaceId,
  });

  if (beginError || !token) {
    console.error('[deleteWorkspace] 삭제 선점 실패:', beginError);
    throw new Error(beginError?.message || '워크스페이스를 삭제할 권한이 없거나 이미 삭제됐어요.');
  }

  const { error: markError } = await supabase.rpc('mark_workspace_deletion_in_progress', {
    p_workspace_id: workspaceId,
    p_deletion_token: token,
  });

  if (markError) {
    console.error('[deleteWorkspace] 삭제 진행 전환 실패:', markError);
    throw new Error(markError.message || DELETE_FAILED_MESSAGE);
  }

  // 여기서부터는 deleting 상태라 자동 만료되지 않는다 — 실패해도 같은 owner가 재시도하면
  // begin_workspace_deletion이 같은 token을 돌려주고, 이미 지워진 파일은 목록에서 빠지므로 멱등적으로 이어진다.
  try {
    await cleanupWorkspaceStorage(supabase, workspaceId);
  } catch (storageError) {
    console.error('[deleteWorkspace] Storage 정리 실패:', storageError);
    throw new Error(DELETE_FAILED_MESSAGE);
  }

  const { error: finalizeError } = await supabase.rpc('finalize_workspace_deletion', {
    p_workspace_id: workspaceId,
    p_deletion_token: token,
  });

  if (finalizeError) {
    console.error('[deleteWorkspace] 삭제 완료 실패:', finalizeError);
    throw new Error(finalizeError.message || DELETE_FAILED_MESSAGE);
  }

  revalidatePath('/workspaces');
}
