'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { CalendarEventColor } from '../model/calendar-event.types';
import { createCalendarEvent } from './create-calendar-event';
import { calendarEventsByWorkspaceQueryKey } from './use-calendar-events-by-workspace-id';

export function useCreateCalendarEvent(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      title: string;
      date: string;
      time: string | null;
      color: CalendarEventColor;
    }) => createCalendarEvent({ workspaceId, ...params }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: calendarEventsByWorkspaceQueryKey(workspaceId) });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : '일정 생성에 실패했습니다');
    },
  });
}
