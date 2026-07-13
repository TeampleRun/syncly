'use client';

// 스프린트 생성 뮤테이션 — 성공 시 sprints 무효화(목록/셀렉터 갱신)
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createSprint } from './create-sprint';
import type { SprintInput } from '../model/sprint.schema';

export function useCreateSprint(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { input: SprintInput }) =>
      createSprint({ input: params.input, workspaceId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sprints'] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : '스프린트 생성에 실패했습니다');
    },
  });
}
