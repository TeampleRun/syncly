'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { deleteCalendarEvent } from './delete-calendar-event';
import { calendarEventsByWorkspaceQueryKey } from './use-calendar-events-by-workspace-id';

export function useDeleteCalendarEvent(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => deleteCalendarEvent({ workspaceId, eventId }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: calendarEventsByWorkspaceQueryKey(workspaceId) });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : '일정 삭제에 실패했습니다');
    },
  });
}
