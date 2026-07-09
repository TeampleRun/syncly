export type CalendarEventColor = 'violet' | 'purple' | 'blue' | 'green' | 'amber' | 'coral' | 'pink';

export interface CalendarEvent {
  id: string;
  workspaceId: string;
  title: string;
  date: string;
  time: string | null;
  color: CalendarEventColor;
}

export interface CalendarEventFormValues {
  title: string;
  time: string;
  color: CalendarEventColor;
}
