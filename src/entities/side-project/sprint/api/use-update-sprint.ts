'use client';

// 스프린트 수정 뮤테이션 — 성공 시 sprints 무효화
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateSprint } from './update-sprint';
import type { SprintInput } from '../model/sprint.schema';

export function useUpdateSprint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { id: string; input: SprintInput }) => updateSprint(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sprints'] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : '스프린트 수정에 실패했습니다');
    },
  });
}
