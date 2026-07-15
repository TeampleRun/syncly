'use server';

import { createSupabaseServerClient } from '@/shared/api/supabase/server';

import { toCalendarEventInsert } from '../model/calendar-event.mapper';
import type { CalendarEventColor } from '../model/calendar-event.types';

export async function updateCalendarEvent(params: {
  workspaceId: string;
  eventId: string;
  title: string;
  date: string;
  time: string | null;
  color: CalendarEventColor;
}): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const payload = toCalendarEventInsert({
    workspaceId: params.workspaceId,
    title: params.title.trim(),
    date: params.date,
    time: params.time?.trim() || null,
    color: params.color,
    createdBy: '',
  });

  const { error } = await supabase
    .from('calendar_events')
    .update({
      title: payload.title,
      description: payload.description,
      event_type: payload.event_type,
      starts_at: payload.starts_at,
      ends_at: payload.ends_at,
    })
    .eq('workspace_id', params.workspaceId)
    .eq('id', params.eventId);

  if (error) {
    console.error('[calendar/updateCalendarEvent] update 실패:', error);
    throw new Error('일정 수정에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }
}
