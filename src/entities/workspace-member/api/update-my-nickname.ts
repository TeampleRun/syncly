'use server';

// 현재 사용자의 워크스페이스 닉네임 수정 서버액션 — workspace_members update
// RLS(members_update_self)에 의해 본인 멤버십만 수정할 수 있다.
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getCurrentUserId } from '@/shared/api/supabase/current-user';
import { createSupabaseServerClient } from '@/shared/api/supabase/server';

const updateMyNicknameInputSchema = z.object({
  workspaceId: z.guid(),
  nickname: z
    .string()
    .trim()
    .min(1, '닉네임을 입력해주세요')
    .max(20, '닉네임은 20자 이내로 입력해주세요'),
});

export type UpdateMyNicknameInput = z.infer<typeof updateMyNicknameInputSchema>;

export async function updateMyNickname(input: UpdateMyNicknameInput): Promise<void> {
  const parsed = updateMyNicknameInputSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? '입력값이 올바르지 않습니다');
  }

  const userId = await getCurrentUserId();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('workspace_members')
    .update({ workspace_nickname: parsed.data.nickname })
    .eq('workspace_id', parsed.data.workspaceId)
    .eq('user_id', userId);

  if (error) {
    // (workspace_id, workspace_nickname) 유니크 제약 위반은 사용자 친화적 메시지로 안내한다.
    if (error.code === '23505') {
      throw new Error('이미 사용 중인 닉네임이에요. 다른 닉네임을 입력해주세요.');
    }
    console.error('[updateMyNickname] update 실패:', error);
    throw new Error('닉네임 저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }

  revalidatePath(`/workspaces/${parsed.data.workspaceId}/settings`);
}
