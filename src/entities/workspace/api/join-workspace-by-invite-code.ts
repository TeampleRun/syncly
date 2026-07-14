'use server';

// 초대 코드로 워크스페이스 참여 서버액션 — join_workspace_by_invite_code RPC
// (참여자는 RPC 내부에서 auth.uid()로 강제하고, 활성/유효 검증 + 멤버십 insert를
//  security definer 함수가 트랜잭션으로 처리)
import { createSupabaseServerClient } from '@/shared/api/supabase/server';

export async function joinWorkspaceByInviteCode(code: string): Promise<{ workspaceId: string }> {
  const trimmed = code.trim();
  if (!trimmed) {
    throw new Error('유효하지 않은 초대 링크입니다.');
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc('join_workspace_by_invite_code', {
    p_code: trimmed,
  });

  if (error) {
    // 유효하지 않거나 비활성화된 초대는 RPC가 던진 메시지를 그대로 전달한다.
    console.error('[joinWorkspaceByInviteCode] RPC 실패:', error);
    throw new Error(error.message || '워크스페이스 참여에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }

  return { workspaceId: data };
}
