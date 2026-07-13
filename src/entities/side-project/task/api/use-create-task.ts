'use client';

// 업무 생성 뮤테이션 — 서버액션을 mutationFn으로 감싸고, 성공 시 tasks/sprints 쿼리를 무효화한다.
// (생성은 스프린트 포인트 집계도 바꾸므로 sprints도 무효화)
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createTask } from './create-task';
import type { TaskInput } from '../model/task.schema';

export function useCreateTask(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { input: TaskInput; sprintId: string | null }) =>
      createTask({ input: params.input, workspaceId, sprintId: params.sprintId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['sprints'] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : '업무 생성에 실패했습니다');
    },
  });
}
