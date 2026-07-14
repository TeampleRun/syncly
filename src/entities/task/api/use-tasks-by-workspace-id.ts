'use client';

import { useQuery } from '@tanstack/react-query';

import { getTasksByWorkspaceId } from './get-tasks-by-workspace-id';

export const tasksByWorkspaceQueryKey = (workspaceId: string) =>
  ['tasks', 'workspace', workspaceId] as const;

export function useTasksByWorkspaceId(workspaceId: string) {
  return useQuery({
    queryKey: tasksByWorkspaceQueryKey(workspaceId),
    queryFn: () => getTasksByWorkspaceId(workspaceId),
  });
}
