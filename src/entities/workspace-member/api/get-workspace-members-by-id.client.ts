'use client';

import { getSupabaseBrowserClient } from '@/shared/api/supabase/client';

import type { WorkspaceMember } from '../model/workspace-member.types';

interface WorkspaceMemberQueryRow {
  workspace_id: string;
  user_id: string;
  workspace_nickname: string;
  role: WorkspaceMember['role'];
}

interface ProfileQueryRow {
  id: string;
  email: string;
  real_name: string;
}

export async function getWorkspaceMembersByWorkspaceIdClient(
  workspaceId: string,
): Promise<WorkspaceMember[]> {
  const supabase = getSupabaseBrowserClient();

  const { data: memberships, error: membershipError } = await supabase
    .from('workspace_members')
    .select('workspace_id, user_id, workspace_nickname, role')
    .eq('workspace_id', workspaceId)
    .order('joined_at');

  if (membershipError) {
    throw new Error(`워크스페이스 멤버 조회에 실패했습니다: ${membershipError.message}`);
  }

  const membershipRows = (memberships ?? []) as WorkspaceMemberQueryRow[];
  const userIds = membershipRows.map((member) => member.user_id);

  if (userIds.length === 0) {
    return [];
  }

  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id, email, real_name')
    .in('id', userIds);

  if (profileError) {
    throw new Error(`멤버 프로필 조회에 실패했습니다: ${profileError.message}`);
  }

  const profilesById = new Map(
    ((profiles ?? []) as ProfileQueryRow[]).map((profile) => [profile.id, profile]),
  );

  return membershipRows.flatMap((member) => {
    const profile = profilesById.get(member.user_id);

    if (!profile) {
      return [];
    }

    return {
      workspaceId: member.workspace_id,
      userId: member.user_id,
      workspaceNickname: member.workspace_nickname,
      avatarLabel: profile.real_name.slice(0, 1),
      email: profile.email,
      role: member.role,
      status: 'joined',
    };
  });
}
