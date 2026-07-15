import type { CalendarEvent, CalendarEventColor } from './calendar-event.types';

export interface CalendarEventRow {
  id: string;
  workspace_id: string;
  title: string;
  starts_at: string;
  description: string | null;
}

interface CalendarEventMetadata {
  color?: CalendarEventColor;
  time?: string | null;
}

const defaultColor: CalendarEventColor = 'violet';

function isCalendarEventColor(value: unknown): value is CalendarEventColor {
  return (
    value === 'violet' ||
    value === 'purple' ||
    value === 'blue' ||
    value === 'green' ||
    value === 'amber' ||
    value === 'coral' ||
    value === 'pink'
  );
}

function parseMetadata(description: string | null): CalendarEventMetadata {
  if (!description) {
    return {};
  }

  try {
    const parsed = JSON.parse(description) as CalendarEventMetadata;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function formatIsoDateInKst(isoDateTime: string) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return formatter.format(new Date(isoDateTime));
}

export function normalizeCalendarEventTime(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const trimmedTime = value.trim();
  if (!trimmedTime) {
    return null;
  }

  const basicMatch = trimmedTime.match(/^(\d{1,2}):(\d{2})$/);
  if (basicMatch) {
    const hour = Number(basicMatch[1]);
    const minute = Number(basicMatch[2]);

    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
      return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    }
  }

  const koreanMatch = trimmedTime.match(/^(오전|오후)\s*(\d{1,2}):(\d{2})$/);
  if (koreanMatch) {
    const [, meridiem, rawHour, rawMinute] = koreanMatch;
    let hour = Number(rawHour);
    const minute = Number(rawMinute);

    if (minute < 0 || minute > 59 || hour < 1 || hour > 12) {
      return null;
    }

    if (meridiem === '오전') {
      if (hour === 12) hour = 0;
    } else if (hour < 12) {
      hour += 12;
    }

    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  }

  return null;
}

export function formatCalendarEventTimeLabel(value: string | null | undefined): string {
  const normalizedTime = normalizeCalendarEventTime(value);

  if (!normalizedTime) {
    return '시간 미정';
  }

  const [rawHour, rawMinute] = normalizedTime.split(':');
  const hour = Number(rawHour);
  const minute = Number(rawMinute);
  const meridiem = hour < 12 ? '오전' : '오후';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;

  return `${meridiem} ${displayHour}:${String(minute).padStart(2, '0')}`;
}

export function toCalendarEvent(row: CalendarEventRow): CalendarEvent {
  const metadata = parseMetadata(row.description);

  return {
    id: row.id,
    workspaceId: row.workspace_id,
    title: row.title,
    date: formatIsoDateInKst(row.starts_at),
    time: normalizeCalendarEventTime(metadata.time),
    color: isCalendarEventColor(metadata.color) ? metadata.color : defaultColor,
  };
}

function parseTimeTo24Hour(time: string) {
  const normalizedTime = normalizeCalendarEventTime(time);
  if (!normalizedTime) {
    return { hour: 0, minute: 0 };
  }

  const [hour, minute] = normalizedTime.split(':');
  return { hour: Number(hour), minute: Number(minute) };
}

export function toCalendarEventInsert(params: {
  workspaceId: string;
  title: string;
  date: string;
  time: string | null;
  color: CalendarEventColor;
  createdBy: string;
}) {
  const { hour, minute } = parseTimeTo24Hour(params.time ?? '');
  const startsAt = `${params.date}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00+09:00`;

  return {
    workspace_id: params.workspaceId,
    created_by: params.createdBy,
    task_id: null,
    title: params.title,
    description: JSON.stringify({
      time: params.time,
      color: params.color,
    }),
    event_type: 'meeting' as const,
    starts_at: startsAt,
    ends_at: null,
  };
}
