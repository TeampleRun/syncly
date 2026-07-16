import type { CalendarEvent } from '@/entities/calendar-event';
import { formatCalendarEventTimeLabel } from '@/entities/calendar-event';

import type { CalendarMonth, ScheduleEvent } from './schedule-event.types';

function formatIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function sortByTime(left: CalendarEvent, right: CalendarEvent) {
  if (left.time === right.time) {
    return left.title.localeCompare(right.title, 'ko');
  }

  if (!left.time) {
    return 1;
  }

  if (!right.time) {
    return -1;
  }

  return left.time.localeCompare(right.time);
}

export function selectTodayScheduleEvents(
  calendarEvents: CalendarEvent[],
  currentDate = new Date(),
): ScheduleEvent[] {
  const todayIsoDate = formatIsoDate(currentDate);

  return calendarEvents
    .filter((event) => event.date === todayIsoDate)
    .sort(sortByTime)
    .map((event) => ({
      id: event.id,
      title: event.title,
      time: formatCalendarEventTimeLabel(event.time),
      type: event.eventType,
    }));
}

export function buildCalendarMonthFromEvents(
  calendarEvents: CalendarEvent[],
  currentDate = new Date(),
): CalendarMonth {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const currentMonthPrefix = `${year}-${String(month).padStart(2, '0')}-`;

  const eventDays = Array.from(
    new Set(
      calendarEvents
        .filter((event) => event.date.startsWith(currentMonthPrefix))
        .map((event) => Number(event.date.slice(-2)))
        .filter((day) => Number.isInteger(day) && day > 0),
    ),
  ).sort((left, right) => left - right);

  return {
    year,
    month,
    today: currentDate.getDate(),
    eventDays,
  };
}
