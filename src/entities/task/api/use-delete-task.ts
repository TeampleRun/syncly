'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { deleteTask } from './delete-task';
import { tasksByWorkspaceQueryKey } from './use-tasks-by-workspace-id';

export function useDeleteTask(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: tasksByWorkspaceQueryKey(workspaceId) });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : '업무 삭제에 실패했습니다');
    },
  });
}
