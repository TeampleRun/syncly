'use server';

// 워크스페이스 삭제 서버액션 — owner면 멤버 수와 무관하게 실행 가능 (RLS: workspaces_delete_owner)
// Storage 파일은 FK 캐스케이드 대상이 아니라 workspaces row 삭제 전에 먼저 지워야 한다(이후엔 RLS가 막음).
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getCurrentUserId } from '@/shared/api/supabase/current-user';
import { createSupabaseServerClient } from '@/shared/api/supabase/server';

const WORKSPACE_RESOURCES_BUCKET = 'workspace-resources';
const STORAGE_LIST_PAGE_SIZE = 1000;

const deleteWorkspaceInputSchema = z.object({
  workspaceId: z.guid(),
});

export type DeleteWorkspaceInput = z.infer<typeof deleteWorkspaceInputSchema>;

// .list()는 한 번에 최대 1000개만 반환하므로, offset을 늘려가며 전체 파일 목록을 모은다.
async function listAllStorageFileNames(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
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

    names.push(...page.map((file) => file.name));

    if (page.length < STORAGE_LIST_PAGE_SIZE) {
      break;
    }
    offset += STORAGE_LIST_PAGE_SIZE;
  }

  return names;
}

export async function deleteWorkspace(input: DeleteWorkspaceInput): Promise<void> {
  const parsed = deleteWorkspaceInputSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error('입력값이 올바르지 않습니다');
  }

  const { workspaceId } = parsed.data;
  const userId = await getCurrentUserId();
  const supabase = await createSupabaseServerClient();

  // Storage RLS는 "본인이 올린 파일"까지 허용해 일반 멤버가 직접 호출해도 자기 파일이 지워질 수 있어,
  // 삭제 시도 전에 소유자인지부터 확인한다.
  const { data: workspace, error: fetchError } = await supabase
    .from('workspaces')
    .select('owner_id')
    .eq('id', workspaceId)
    .maybeSingle();

  if (fetchError || !workspace) {
    throw new Error('워크스페이스를 찾을 수 없어요.');
  }

  if (workspace.owner_id !== userId) {
    throw new Error('워크스페이스 소유자만 삭제할 수 있어요.');
  }

  let fileNames: string[];
  try {
    fileNames = await listAllStorageFileNames(supabase, workspaceId);
  } catch (listError) {
    console.error('[deleteWorkspace] Storage 목록 조회 실패:', listError);
    throw new Error('워크스페이스 삭제에 실패했어요. 잠시 후 다시 시도해주세요.');
  }

  // remove()도 한 번에 최대 1000개까지만 처리되므로, list()와 동일한 크기로 나눠서 삭제한다.
  const paths = fileNames.map((name) => `${workspaceId}/${name}`);
  for (let index = 0; index < paths.length; index += STORAGE_LIST_PAGE_SIZE) {
    const batch = paths.slice(index, index + STORAGE_LIST_PAGE_SIZE);
    const { error: removeError } = await supabase.storage
      .from(WORKSPACE_RESOURCES_BUCKET)
      .remove(batch);

    if (removeError) {
      console.error('[deleteWorkspace] Storage 파일 삭제 실패:', removeError);
      throw new Error('워크스페이스 삭제에 실패했어요. 잠시 후 다시 시도해주세요.');
    }
  }

  // RLS가 막으면 error 없이 0건 삭제로 조용히 끝날 수 있어(예: 삭제 도중 다른 곳에서 소유권이
  // 넘어간 경우), select로 실제 삭제된 row가 있는지까지 확인한다.
  const { data: deleted, error } = await supabase
    .from('workspaces')
    .delete()
    .eq('id', workspaceId)
    .eq('owner_id', userId)
    .select('id')
    .maybeSingle();

  if (error || !deleted) {
    console.error('[deleteWorkspace] delete 실패:', error);
    throw new Error('워크스페이스를 삭제할 권한이 없거나 이미 삭제됐어요.');
  }

  revalidatePath('/workspaces');
}
