'use client';

import { getSupabaseBrowserClient } from '@/shared/api/supabase/client';

import type { WorkspaceMember } from '../model/workspace-member.types';

interface WorkspaceMemberQueryRow {
  workspace_id: string;
  user_id: string;
  workspace_nickname: string;
  role: WorkspaceMember['role'];
  profile: {
    email: string;
    real_name: string;
  } | null;
}

export async function getWorkspaceMembersByWorkspaceIdClient(
  workspaceId: string,
): Promise<WorkspaceMember[]> {
  const supabase = getSupabaseBrowserClient();

  const { data: memberships, error: membershipError } = await supabase
    .from('workspace_members')
    .select(
      'workspace_id, user_id, workspace_nickname, role, profile:profiles!workspace_members_user_id_fkey(email, real_name)',
    )
    .eq('workspace_id', workspaceId)
    .order('joined_at');

  if (membershipError) {
    throw new Error(`워크스페이스 멤버 조회에 실패했습니다: ${membershipError.message}`);
  }

  return ((memberships ?? []) as WorkspaceMemberQueryRow[]).map((member) => ({
      workspaceId: member.workspace_id,
      userId: member.user_id,
      workspaceNickname: member.workspace_nickname,
      avatarLabel: member.profile?.real_name.slice(0, 1) ?? '?',
      email: member.profile?.email ?? '',
      role: member.role,
      // 현재 실데이터 스키마는 초대 대기 상태를 별도 컬럼으로 저장하지 않는다.
      // workspace_members row는 참여 확정 멤버만 의미하므로 joined로 노출한다.
      status: 'joined',
    }));
}
