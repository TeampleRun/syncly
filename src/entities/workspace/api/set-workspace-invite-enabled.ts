'use server';

// 초대 링크 활성화/비활성화 서버액션 — workspaces.invite_enabled update
// RLS(workspaces_update_owner)에 의해 소유자만 변경할 수 있다.
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createSupabaseServerClient } from '@/shared/api/supabase/server';

const setInviteEnabledInputSchema = z.object({
  workspaceId: z.guid(),
  enabled: z.boolean(),
});

export type SetWorkspaceInviteEnabledInput = z.infer<typeof setInviteEnabledInputSchema>;

export async function setWorkspaceInviteEnabled(
  input: SetWorkspaceInviteEnabledInput,
): Promise<void> {
  const parsed = setInviteEnabledInputSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? '입력값이 올바르지 않습니다');
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('workspaces')
    .update({ invite_enabled: parsed.data.enabled })
    .eq('id', parsed.data.workspaceId);

  if (error) {
    console.error('[setWorkspaceInviteEnabled] update 실패:', error);
    throw new Error('초대 링크 설정 변경에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }

  revalidatePath(`/workspaces/${parsed.data.workspaceId}/settings`);
}
