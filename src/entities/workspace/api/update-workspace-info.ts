'use server';

// 워크스페이스 정보(이름·설명) 수정 서버액션 — workspaces update
// RLS(workspaces_update_owner)에 의해 소유자만 수정할 수 있다.
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import { createWorkspaceSchema } from '../model/create-workspace.schema';

// 생성 폼과 동일한 이름·설명 검증에 대상 워크스페이스 id를 더한다.
const updateWorkspaceInfoInputSchema = createWorkspaceSchema.extend({ id: z.guid() });

export type UpdateWorkspaceInfoInput = z.infer<typeof updateWorkspaceInfoInputSchema>;

export async function updateWorkspaceInfo(input: UpdateWorkspaceInfoInput): Promise<void> {
  // 클라이언트 검증과 별개로 서버에서 재검증한다.
  const parsed = updateWorkspaceInfoInputSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? '입력값이 올바르지 않습니다');
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('workspaces')
    .update({
      name: parsed.data.name,
      description: parsed.data.description ?? null,
    })
    .eq('id', parsed.data.id);

  if (error) {
    console.error('[updateWorkspaceInfo] update 실패:', error);
    throw new Error('워크스페이스 정보 저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }

  revalidatePath(`/workspaces/${parsed.data.id}/settings`);
}
