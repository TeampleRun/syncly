'use client';

import { create } from 'zustand';
import type { CalendarEvent } from '@/entities/calendar-event';

interface CalendarEventsStore {
  calendarEventsByWorkspaceId: Record<string, CalendarEvent[]>;
  initializeWorkspace: (workspaceId: string, events: CalendarEvent[]) => void;
  addCalendarEvent: (workspaceId: string, event: CalendarEvent) => void;
  removeCalendarEvent: (workspaceId: string, eventId: string) => void;
}

export const useCalendarEventsStore = create<CalendarEventsStore>((set) => ({
  calendarEventsByWorkspaceId: {},
  initializeWorkspace: (workspaceId, events) =>
    set((state) => {
      if (state.calendarEventsByWorkspaceId[workspaceId]) {
        return state;
      }

      return {
        calendarEventsByWorkspaceId: {
          ...state.calendarEventsByWorkspaceId,
          [workspaceId]: events,
        },
      };
    }),
  addCalendarEvent: (workspaceId, event) =>
    set((state) => ({
      calendarEventsByWorkspaceId: {
        ...state.calendarEventsByWorkspaceId,
        [workspaceId]: [...(state.calendarEventsByWorkspaceId[workspaceId] ?? []), event],
      },
    })),
  removeCalendarEvent: (workspaceId, eventId) =>
    set((state) => ({
      calendarEventsByWorkspaceId: {
        ...state.calendarEventsByWorkspaceId,
        [workspaceId]: (state.calendarEventsByWorkspaceId[workspaceId] ?? []).filter(
          (event) => event.id !== eventId,
        ),
      },
    })),
}));
