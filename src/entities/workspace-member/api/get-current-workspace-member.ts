// 현재 로그인한 사용자의 프로필과 워크스페이스 내 역할을 Shell 표시용으로 조회한다.
import { cache } from 'react';
import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import type { WorkspaceMember } from '../model/workspace-member.types';

export const getCurrentWorkspaceMember = cache(
  async (workspaceId: string): Promise<WorkspaceMember | null> => {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      throw new Error(`로그인 사용자 조회에 실패했습니다: ${userError.message}`);
    }

    if (!user) {
      return null;
    }

    const { data: membership, error: membershipError } = await supabase
      .from('workspace_members')
      .select('workspace_id, user_id, workspace_nickname, role')
      .eq('workspace_id', workspaceId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (membershipError) {
      throw new Error(`현재 워크스페이스 멤버 조회에 실패했습니다: ${membershipError.message}`);
    }

    if (!membership) {
      return null;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email, real_name')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      throw new Error(`현재 사용자 프로필 조회에 실패했습니다: ${profileError.message}`);
    }

    const displayName =
      profile?.real_name || membership.workspace_nickname || user.email || '사용자';

    return {
      workspaceId: membership.workspace_id,
      userId: membership.user_id,
      workspaceNickname: membership.workspace_nickname || displayName,
      avatarLabel: displayName.slice(0, 1),
      email: profile?.email || user.email || '',
      role: membership.role,
      status: 'joined',
    };
  },
);
