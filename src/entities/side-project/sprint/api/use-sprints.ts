'use client';

// 워크스페이스 스프린트 목록 쿼리 훅 — GET은 tanstack-query 컨벤션(§5)
import { useQuery } from '@tanstack/react-query';
import { getSprints } from './get-sprints';

// 쓰기 후 invalidateQueries({ queryKey: ['sprints'] })로 무효화한다
export const sprintsQueryKey = (workspaceId: string) => ['sprints', workspaceId] as const;

export function useSprints(workspaceId: string) {
  return useQuery({
    queryKey: sprintsQueryKey(workspaceId),
    queryFn: () => getSprints(workspaceId),
  });
}
