'use server';

// 현재 사용자가 수신한 워크스페이스 알림 최근 10건과 읽지 않은 개수를 조회합니다.
import { z } from 'zod';
import { getCurrentUserId } from '@/shared/api/supabase/current-user';
import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import type {
  NotificationData,
  NotificationItem,
  NotificationPageData,
  NotificationType,
} from '../model/notification.types';

const workspaceIdSchema = z.guid();

function toNotificationItem(row: {
  id: string;
  workspace_id: string;
  type: string;
  title: string;
  body: string | null;
  link_path: string;
  read_at: string | null;
  created_at: string;
}): NotificationItem {
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    type: row.type as NotificationType,
    title: row.title,
    body: row.body,
    linkPath: row.link_path,
    readAt: row.read_at,
    createdAt: row.created_at,
  };
}

export async function getNotifications(workspaceId: string): Promise<NotificationData> {
  const parsedWorkspaceId = workspaceIdSchema.parse(workspaceId);
  const supabase = await createSupabaseServerClient();
  // 현재 사용자가 수신자인 알림만 조회하기 위한 세션 사용자 ID입니다.
  const currentUserId = await getCurrentUserId();
  const [notificationsResult, unreadCountResult] = await Promise.all([
    supabase
      .from('notifications')
      .select('id, workspace_id, type, title, body, link_path, read_at, created_at')
      .eq('workspace_id', parsedWorkspaceId)
      .eq('recipient_id', currentUserId)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', parsedWorkspaceId)
      .eq('recipient_id', currentUserId)
      .is('read_at', null),
  ]);

  if (notificationsResult.error || unreadCountResult.error) {
    console.error(
      '[notification] 알림 조회 실패:',
      notificationsResult.error ?? unreadCountResult.error,
    );
    throw new Error('알림을 불러오지 못했습니다.');
  }

  const notifications = (notificationsResult.data ?? []).map(toNotificationItem);
  return {
    notifications,
    unreadCount: unreadCountResult.count ?? 0,
  };
}

// 전체 알림 화면에서 현재 사용자에게 도착한 기록을 페이지 단위로 조회합니다.
export async function getNotificationsPage(input: {
  workspaceId: string;
  offset?: number;
}): Promise<NotificationPageData> {
  const workspaceId = workspaceIdSchema.parse(input.workspaceId);
  const offset = z.number().int().min(0).parse(input.offset ?? 0);
  const pageSize = 20;
  const supabase = await createSupabaseServerClient();
  const currentUserId = await getCurrentUserId();
  const { data, error } = await supabase
    .from('notifications')
    .select('id, workspace_id, type, title, body, link_path, read_at, created_at')
    .eq('workspace_id', workspaceId)
    .eq('recipient_id', currentUserId)
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize);

  if (error) {
    console.error('[notification] 전체 알림 조회 실패:', error);
    throw new Error('알림을 불러오지 못했습니다.');
  }

  const rows = data ?? [];
  return {
    notifications: rows.slice(0, pageSize).map(toNotificationItem),
    hasMore: rows.length > pageSize,
  };
}
