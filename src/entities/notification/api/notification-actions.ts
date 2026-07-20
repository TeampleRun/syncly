'use server';

// 현재 사용자가 수신한 알림을 개별 또는 일괄 읽음 처리합니다.
import { z } from 'zod';
import { getCurrentUserId } from '@/shared/api/supabase/current-user';
import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import type { NotificationActionResult } from '../model/notification.types';

const markNotificationsReadSchema = z.object({
  workspaceId: z.guid(),
  notificationIds: z.array(z.guid()).min(1).optional(),
});

export async function markNotificationsRead(input: {
  workspaceId: string;
  notificationIds?: string[];
}): Promise<NotificationActionResult<void>> {
  const parsed = markNotificationsReadSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: '읽음 처리할 알림 정보가 올바르지 않습니다.' };
  }

  try {
    const supabase = await createSupabaseServerClient();
    // 수신자 본인의 미읽음 알림만 수정하기 위한 세션 사용자 ID입니다.
    const currentUserId = await getCurrentUserId();
    let query = supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('workspace_id', parsed.data.workspaceId)
      .eq('recipient_id', currentUserId)
      .is('read_at', null);

    if (parsed.data.notificationIds) {
      query = query.in('id', parsed.data.notificationIds);
    }

    const { error } = await query;

    if (error) {
      console.error('[notification] 읽음 처리 실패:', error);
      return { ok: false, message: '알림 읽음 처리에 실패했습니다.' };
    }

    return { ok: true, data: undefined };
  } catch (error) {
    console.error('[notification] 읽음 처리 중 예상하지 못한 오류:', error);
    return { ok: false, message: '알림 읽음 처리에 실패했습니다.' };
  }
}
