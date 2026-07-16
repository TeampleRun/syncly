'use client';

// 알림 목록 캐시, 읽음 처리 mutation, Supabase Realtime INSERT 구독을 한 곳에서 관리합니다.
import { useEffect } from 'react';
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
): NotificationData | undefined {
  if (!currentData || currentData.notifications.some((item) => item.id === notification.id)) {
    return currentData;
  }

  return {
    notifications: [notification, ...currentData.notifications].slice(0, 10),
    unreadCount: currentData.unreadCount + (notification.readAt ? 0 : 1),
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
  const notificationQuery = useQuery({
    queryKey: notificationsQueryKey(workspaceId),
    queryFn: () => getNotifications(workspaceId),
  });
  const markReadMutation = useMutation({
    mutationFn: (notificationIds?: string[]) =>
      markNotificationsRead({ workspaceId, notificationIds }),
    onSuccess: (result, notificationIds) => {
      if (!result.ok) return;

      const readAt = new Date().toISOString();
      queryClient.setQueryData<NotificationData>(
        notificationsQueryKey(workspaceId),
        (currentData) => {
          if (!currentData) return currentData;
          const shouldMarkRead = (notification: NotificationItem) =>
            !notification.readAt && (!notificationIds || notificationIds.includes(notification.id));
          const notifications = currentData.notifications.map((notification) =>
            shouldMarkRead(notification) ? { ...notification, readAt } : notification,
          );

          return {
            notifications,
            unreadCount: notifications.filter((notification) => !notification.readAt).length,
          };
        },
      );
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
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `workspace_id=eq.${workspaceId}`,
        },
        (payload) => {
          const row = payload.new as NotificationRow;
          if (row.recipient_id !== viewerId) return;

          queryClient.setQueryData<NotificationData>(
            notificationsQueryKey(workspaceId),
            (currentData) => addNotification(currentData, toNotificationItem(row)),
          );
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient, viewerId, workspaceId]);

  return {
    notifications: notificationQuery.data?.notifications ?? [],
    unreadCount: notificationQuery.data?.unreadCount ?? 0,
    isLoading: notificationQuery.isPending,
    isError: notificationQuery.isError,
    markOneAsRead: async (notificationId: string) => markReadMutation.mutateAsync([notificationId]),
    markAllAsRead: async () => markReadMutation.mutateAsync(undefined),
  };
}
