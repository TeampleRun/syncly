'use client';

// 태스크 스프린트 편입/해제 뮤테이션 — 성공 시 tasks + sprints 무효화.
// (편입/해제는 백로그·스프린트 목록과 스프린트 포인트 집계를 모두 바꾸므로 둘 다 무효화)
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateTaskSprint } from './update-task-sprint';

export function useUpdateTaskSprint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { id: string; sprintId: string | null }) =>
      updateTaskSprint(params.id, params.sprintId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['sprints'] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : '스프린트 편입에 실패했습니다');
    },
  });
}
