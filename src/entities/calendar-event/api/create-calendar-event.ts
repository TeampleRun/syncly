'use server';

import { getCurrentUserId } from '@/shared/api/supabase/current-user';
import { createSupabaseServerClient } from '@/shared/api/supabase/server';

import { toCalendarEventInsert } from '../model/calendar-event.mapper';
import type { CalendarEventColor } from '../model/calendar-event.types';

export async function createCalendarEvent(params: {
  workspaceId: string;
  title: string;
  date: string;
  time: string | null;
  color: CalendarEventColor;
}): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const currentUserId = await getCurrentUserId();

  const payload = toCalendarEventInsert({
    workspaceId: params.workspaceId,
    title: params.title.trim(),
    date: params.date,
    time: params.time?.trim() || null,
    color: params.color,
    createdBy: currentUserId,
  });

  const { error } = await supabase.from('calendar_events').insert(payload);

  if (error) {
    console.error('[calendar/createCalendarEvent] insert 실패:', error);
    throw new Error('일정 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }
}
