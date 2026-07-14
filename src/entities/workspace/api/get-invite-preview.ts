// 초대 미리보기 조회 — get_invite_preview RPC (security definer로 비멤버도 활성 코드면 요약 조회)
// 서버 전용(next/headers 의존)이므로 barrel에 넣지 않고 RSC에서 직접 경로로 import한다.
import { cache } from 'react';
import { createSupabaseServerClient } from '@/shared/api/supabase/server';

export interface InvitePreview {
  workspaceId: string;
  name: string;
  memberCount: number;
}

export const getInvitePreview = cache(async (code: string): Promise<InvitePreview | null> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc('get_invite_preview', { p_code: code });

  if (error) {
    throw new Error(`초대 정보 조회에 실패했습니다: ${error.message}`);
  }

  const preview = data?.[0];
  if (!preview) {
    return null;
  }

  return {
    workspaceId: preview.workspace_id,
    name: preview.name,
    memberCount: preview.member_count,
  };
});
