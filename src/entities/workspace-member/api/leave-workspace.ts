'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getCurrentUserId } from '@/shared/api/supabase/current-user';
import { createSupabaseServerClient } from '@/shared/api/supabase/server';

const leaveWorkspaceInputSchema = z.object({
  workspaceId: z.guid(),
});

export type LeaveWorkspaceInput = z.infer<typeof leaveWorkspaceInputSchema>;

export async function leaveWorkspace(input: LeaveWorkspaceInput): Promise<void> {
  const parsed = leaveWorkspaceInputSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error('입력값이 올바르지 않습니다');
  }

  const userId = await getCurrentUserId();
  const supabase = await createSupabaseServerClient();

  // role 조건을 DELETE 자체에 걸어 확인과 삭제를 한 번에 처리한다(owner는 매칭되지 않아 삭제되지 않음).
  const { data: deleted, error } = await supabase
    .from('workspace_members')
    .delete()
    .eq('workspace_id', parsed.data.workspaceId)
    .eq('user_id', userId)
    .eq('role', 'member')
    .select('user_id');

  if (error) {
    throw new Error('팀 탈퇴에 실패했어요. 잠시 후 다시 시도해주세요.');
  }

  if (!deleted || deleted.length === 0) {
    const { data: member } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', parsed.data.workspaceId)
      .eq('user_id', userId)
      .maybeSingle();

    if (member?.role === 'owner') {
      throw new Error(
        '워크스페이스 소유자는 팀을 탈퇴할 수 없어요. 소유권을 이전한 후 탈퇴해주세요.',
      );
    }
    throw new Error('멤버 정보를 찾을 수 없어요');
  }

  revalidatePath('/workspaces');
}
