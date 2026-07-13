'use client';

// 스프린트 삭제 뮤테이션 — 성공 시 sprints + tasks 무효화.
// (삭제된 스프린트의 태스크가 FK로 백로그(sprint_id=null)로 이동하므로 tasks도 갱신)
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteSprint } from './delete-sprint';

export function useDeleteSprint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSprint(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sprints'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : '스프린트 삭제에 실패했습니다');
    },
  });
}
