'use client';

// 스프린트 편입 업무 쿼리 훅 — GET은 tanstack-query 컨벤션(§5)
// sprintId가 아직 정해지지 않았으면(상위 스프린트 로딩 중) enabled=false로 대기한다.
import { useQuery } from '@tanstack/react-query';
import { getSprintTasks } from './get-sprint-tasks';

// 쓰기 후 invalidateQueries({ queryKey: ['tasks'] })로 무효화한다
export const sprintTasksQueryKey = (sprintId: string) => ['tasks', 'sprint', sprintId] as const;

export function useSprintTasks(sprintId: string | undefined) {
  return useQuery({
    queryKey: sprintTasksQueryKey(sprintId ?? ''),
    queryFn: () => getSprintTasks(sprintId as string),
    enabled: !!sprintId,
  });
}
