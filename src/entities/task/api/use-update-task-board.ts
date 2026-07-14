'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { TaskStatus } from '../model/task.types';
import { updateTaskBoard } from './update-task-board';
import { tasksByWorkspaceQueryKey } from './use-tasks-by-workspace-id';

interface UpdateTaskBoardParams {
  workspaceId: string;
  tasks: Array<{
    id: string;
    status: TaskStatus;
    sortOrder: number;
  }>;
}

export function useUpdateTaskBoard(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateTaskBoardParams) => updateTaskBoard(params),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: tasksByWorkspaceQueryKey(workspaceId) });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : '업무 정렬 저장에 실패했습니다');
    },
  });
}
