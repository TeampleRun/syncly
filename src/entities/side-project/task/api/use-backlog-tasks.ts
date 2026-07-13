'use client';

// 백로그(스프린트 미편입) 업무 쿼리 훅 — GET은 tanstack-query 컨벤션(§5)
import { useQuery } from '@tanstack/react-query';
import { getBacklogTasks } from './get-backlog-tasks';

// 쓰기 후 invalidateQueries({ queryKey: ['tasks'] })로 무효화한다
export const backlogTasksQueryKey = (workspaceId: string) =>
  ['tasks', 'backlog', workspaceId] as const;

export function useBacklogTasks(workspaceId: string) {
  return useQuery({
    queryKey: backlogTasksQueryKey(workspaceId),
    queryFn: () => getBacklogTasks(workspaceId),
  });
}
