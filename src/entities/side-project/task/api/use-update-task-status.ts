'use client';

// 칸반 DnD 상태 이동 뮤테이션 — 클라 직접 update를 감싼다.
// DnD는 직접 조작이라 낙관적 업데이트로 카드를 즉시 이동시키고, 실패 시 스냅샷으로 롤백한다.
// 스프린트 포인트(완료 집계)는 RPC 값이라 낙관 반영 대상이 아니고, onSettled 재조회에서 반영된다.
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateTaskStatus } from './update-task-status';
import type { Task, TaskStatus } from '../model/task.types';

interface StatusVariables {
  id: string;
  status: TaskStatus;
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: StatusVariables) => updateTaskStatus(id, status),
    onMutate: async ({ id, status }: StatusVariables) => {
      // 진행 중인 tasks 재조회를 멈춰 낙관 값이 덮이지 않게 한다
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      // 롤백용 스냅샷 확보 후, 캐시된 모든 tasks 목록에서 해당 카드 status만 즉시 교체
      const previous = queryClient.getQueriesData<Task[]>({ queryKey: ['tasks'] });
      queryClient.setQueriesData<Task[]>({ queryKey: ['tasks'] }, (old) =>
        old?.map((task) => (task.id === id ? { ...task, status } : task)),
      );
      return { previous };
    },
    onError: (error, _variables, context) => {
      // 실패 시 스냅샷으로 복원
      context?.previous.forEach(([key, data]) => queryClient.setQueryData(key, data));
      toast.error(error instanceof Error ? error.message : '상태 변경에 실패했습니다');
    },
    onSettled: () => {
      // 성공/실패 무관하게 서버 상태와 재동기화(스프린트 포인트 집계 포함)
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['sprints'] });
    },
  });
}
