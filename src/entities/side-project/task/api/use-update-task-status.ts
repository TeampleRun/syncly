'use client';

// 칸반 DnD 상태 이동 뮤테이션 — 클라 직접 update를 감싸고, 성공 시 tasks/sprints 무효화(완료 포인트 반영)
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateTaskStatus } from './update-task-status';
import type { TaskStatus } from '../model/task.types';

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { id: string; status: TaskStatus }) =>
      updateTaskStatus(params.id, params.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['sprints'] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : '상태 변경에 실패했습니다');
    },
  });
}
