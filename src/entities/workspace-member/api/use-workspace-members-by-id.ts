'use client';

import { useQuery } from '@tanstack/react-query';

import { getWorkspaceMembersByWorkspaceIdClient } from './get-workspace-members-by-id.client';

export const workspaceMembersByWorkspaceQueryKey = (workspaceId: string) =>
  ['workspace-members', 'workspace', workspaceId] as const;

export function useWorkspaceMembersByWorkspaceId(workspaceId: string) {
  return useQuery({
    queryKey: workspaceMembersByWorkspaceQueryKey(workspaceId),
    queryFn: () => getWorkspaceMembersByWorkspaceIdClient(workspaceId),
  });
}
