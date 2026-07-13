// 멤버 조회 함수를 생성합니다

import { cache } from 'react';
import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import type { WorkspaceMember } from '@/entities/workspace-member/model/workspace-member.types';

export const getWorkspaceMembersByWorkspaceId = cache(
  async (workspaceId: string): Promise<WorkspaceMember[]> => {
    const supabase = await createSupabaseServerClient();

    const { data: memberships, error: membershipError } = await supabase
      .from('workspace_members')
      .select('workspace_id, user_id, workspace_nickname, role')
      .eq('workspace_id', workspaceId)
      .order('joined_at');

    if (membershipError) {
      throw new Error(`워크스페이스 멤버 조회에 실패했습니다: ${membershipError.message}`);
    }

    const userIds = (memberships ?? []).map((member) => member.user_id);

    if (userIds.length === 0) {
      return [];
    }

    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id,email,real_name')
      .in('id', userIds);

    if (profileError) {
      throw new Error(`멤버 프로필 조회에 실패했습니다: ${profileError.message}`);
    }

    const profilesById = new Map((profiles ?? []).map((profile) => [profile.id, profile]));

    return (memberships ?? []).flatMap((member) => {
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
  },
);
