'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { CalendarEventColor } from '../model/calendar-event.types';
import { updateCalendarEvent } from './update-calendar-event';
import { calendarEventsByWorkspaceQueryKey } from './use-calendar-events-by-workspace-id';

export function useUpdateCalendarEvent(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      eventId: string;
      title: string;
      date: string;
      time: string | null;
      color: CalendarEventColor;
    }) => updateCalendarEvent({ workspaceId, ...params }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: calendarEventsByWorkspaceQueryKey(workspaceId) });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : '일정 수정에 실패했습니다');
    },
  });
}
