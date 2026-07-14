'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { createTask } from './create-task';
import { tasksByWorkspaceQueryKey } from './use-tasks-by-workspace-id';

export function useCreateTask(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (title: string) => createTask({ workspaceId, title }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: tasksByWorkspaceQueryKey(workspaceId) });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : '업무 생성에 실패했습니다');
    },
  });
}
