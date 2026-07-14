// 멤버 조회 함수를 생성합니다

import { cache } from 'react';
import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import type { WorkspaceMember } from '@/entities/workspace-member/model/workspace-member.types';
import {
  mapWorkspaceMemberRows,
  workspaceMemberSelectQuery,
  type WorkspaceMemberQueryRow,
} from './shared';

export const getWorkspaceMembersByWorkspaceId = cache(
  async (workspaceId: string): Promise<WorkspaceMember[]> => {
    const supabase = await createSupabaseServerClient();

    const { data: memberships, error: membershipError } = await supabase
      .from('workspace_members')
      .select(workspaceMemberSelectQuery)
      .eq('workspace_id', workspaceId)
      .order('joined_at');

    if (membershipError) {
      throw new Error(`워크스페이스 멤버 조회에 실패했습니다: ${membershipError.message}`);
    }

    return mapWorkspaceMemberRows((memberships ?? []) as WorkspaceMemberQueryRow[]);
  },
);
