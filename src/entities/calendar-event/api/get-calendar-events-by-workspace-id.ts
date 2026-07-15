import { getSupabaseBrowserClient } from '@/shared/api/supabase/client';

import { toCalendarEvent, type CalendarEventRow } from '../model/calendar-event.mapper';
import type { CalendarEvent } from '../model/calendar-event.types';

export async function getCalendarEventsByWorkspaceId(workspaceId: string): Promise<CalendarEvent[]> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from('calendar_events')
    .select('id, workspace_id, title, starts_at, description, event_type')
    .eq('workspace_id', workspaceId)
    .order('starts_at');

  if (error) {
    throw new Error(`일정 조회에 실패했습니다: ${error.message}`);
  }

  return ((data ?? []) as CalendarEventRow[]).map(toCalendarEvent);
}
