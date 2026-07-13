'use client';

// 업무 수정 뮤테이션 — 성공 시 tasks/sprints 무효화(포인트 변경 반영)
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateTask } from './update-task';
import type { TaskInput } from '../model/task.schema';

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { id: string; input: TaskInput }) => updateTask(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['sprints'] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : '업무 수정에 실패했습니다');
    },
  });
}
