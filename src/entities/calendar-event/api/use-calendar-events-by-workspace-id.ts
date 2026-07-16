'use client';

import { useQuery } from '@tanstack/react-query';

import { getCalendarEventsByWorkspaceId } from './get-calendar-events-by-workspace-id';

export const calendarEventsByWorkspaceQueryKey = (workspaceId: string) =>
  ['calendar-events', 'workspace', workspaceId] as const;

export function useCalendarEventsByWorkspaceId(workspaceId: string) {
  return useQuery({
    queryKey: calendarEventsByWorkspaceQueryKey(workspaceId),
    queryFn: () => getCalendarEventsByWorkspaceId(workspaceId),
  });
}
