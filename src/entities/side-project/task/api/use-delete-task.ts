'use client';

// 업무 삭제 뮤테이션 — 성공 시 tasks/sprints 무효화(포인트 변경 반영)
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteTask } from './delete-task';

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['sprints'] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : '업무 삭제에 실패했습니다');
    },
  });
}
