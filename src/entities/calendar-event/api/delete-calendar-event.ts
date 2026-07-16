'use server';

import { createSupabaseServerClient } from '@/shared/api/supabase/server';

export async function deleteCalendarEvent(params: {
  workspaceId: string;
  eventId: string;
}): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('calendar_events')
    .delete()
    .eq('workspace_id', params.workspaceId)
    .eq('id', params.eventId);

  if (error) {
    console.error('[calendar/deleteCalendarEvent] delete 실패:', error);
    throw new Error('일정 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }
}
