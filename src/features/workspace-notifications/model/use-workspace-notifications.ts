'use client';

// 알림 목록 캐시, 읽음 처리 mutation, Supabase Realtime 변경 구독을 한 곳에서 관리합니다.
import { useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getNotifications,
  markNotificationsRead,
  notificationsQueryKey,
  type NotificationData,
  type NotificationItem,
  type NotificationType,
} from '@/entities/notification';
import { getSupabaseBrowserClient } from '@/shared/api/supabase/client';
import type { GenericTables } from '@/shared/model/supabase.types';

type NotificationRow = GenericTables<'notifications'>;

function toNotificationItem(row: NotificationRow): NotificationItem {
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

function addNotification(
  currentData: NotificationData | undefined,
  notification: NotificationItem,
): NotificationData {
  if (!currentData) {
    return {
      notifications: [notification],
      unreadCount: notification.readAt ? 0 : 1,
    };
  }

  if (currentData.notifications.some((item) => item.id === notification.id)) return currentData;

  return {
    notifications: [notification, ...currentData.notifications].slice(0, 10),
    unreadCount: currentData.unreadCount + (notification.readAt ? 0 : 1),
  };
}

function updateNotification(
  currentData: NotificationData | undefined,
  notification: NotificationItem,
): NotificationData | undefined {
  if (!currentData) return currentData;

  return {
    ...currentData,
    notifications: currentData.notifications.map((item) =>
      item.id === notification.id ? notification : item,
    ),
  };
}

export function useWorkspaceNotifications({
  workspaceId,
  viewerId,
}: {
  workspaceId: string;
  viewerId: string;
}) {
  // 동일 워크스페이스의 헤더 알림 UI를 함께 갱신하기 위한 TanStack Query 클라이언트입니다.
  const queryClient = useQueryClient();
  // Realtime effect가 렌더마다 재구독하지 않도록 사용자별 Query 키를 안정화합니다.
  const queryKey = useMemo(
    () => notificationsQueryKey(workspaceId, viewerId),
    [viewerId, workspaceId],
  );
  const notificationQuery = useQuery({
    queryKey,
    queryFn: () => getNotifications(workspaceId),
  });
  const markReadMutation = useMutation({
    mutationFn: (notificationIds?: string[]) =>
      markNotificationsRead({ workspaceId, notificationIds }),
    onSuccess: (result) => {
      if (!result.ok) return;
      void queryClient.invalidateQueries({ queryKey });
    },
  });

  useEffect(() => {
    // RLS와 recipient_id를 함께 확인해 현재 사용자에게 도착한 이벤트만 캐시에 넣습니다.
    const supabase = getSupabaseBrowserClient();
    const channel = supabase
      .channel(`workspace-notifications:${workspaceId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `workspace_id=eq.${workspaceId}`,
        },
        (payload) => {
          const row = payload.new as NotificationRow;
          if (row.recipient_id !== viewerId) return;

          const notification = toNotificationItem(row);
          if (payload.eventType === 'INSERT') {
            queryClient.setQueryData<NotificationData>(queryKey, (currentData) =>
              addNotification(currentData, notification),
            );
          }

          if (payload.eventType === 'UPDATE') {
            queryClient.setQueryData<NotificationData>(queryKey, (currentData) =>
              updateNotification(currentData, notification),
            );
          }

          void queryClient.invalidateQueries({ queryKey });
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient, queryKey, viewerId, workspaceId]);

  return {
    notifications: notificationQuery.data?.notifications ?? [],
    unreadCount: notificationQuery.data?.unreadCount ?? 0,
    isLoading: notificationQuery.isPending,
    isError: notificationQuery.isError,
    markOneAsRead: async (notificationId: string) => markReadMutation.mutateAsync([notificationId]),
    markAllAsRead: async () => markReadMutation.mutateAsync(undefined),
  };
}
