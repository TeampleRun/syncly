'use client';

import { getSupabaseBrowserClient } from '@/shared/api/supabase/client';

import type { WorkspaceMember } from '../model/workspace-member.types';
import {
  mapWorkspaceMemberRows,
  workspaceMemberSelectQuery,
  type WorkspaceMemberQueryRow,
} from './shared';

export async function getWorkspaceMembersByWorkspaceIdClient(
  workspaceId: string,
): Promise<WorkspaceMember[]> {
  const supabase = getSupabaseBrowserClient();

  const { data: memberships, error: membershipError } = await supabase
    .from('workspace_members')
    .select(workspaceMemberSelectQuery)
    .eq('workspace_id', workspaceId)
    .order('joined_at');

  if (membershipError) {
    throw new Error(`워크스페이스 멤버 조회에 실패했습니다: ${membershipError.message}`);
  }

  return mapWorkspaceMemberRows((memberships ?? []) as WorkspaceMemberQueryRow[]);
}
