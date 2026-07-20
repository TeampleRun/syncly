'use client';

// 워크스페이스에서 수신한 전체 알림을 페이지 단위로 조회하고 읽음 처리하는 화면입니다.
import { useMemo } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCheck, ClipboardList, Megaphone } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  getNotificationsPage,
  markNotificationsRead,
  notificationsQueryKey,
  type NotificationItem,
  type NotificationPageData,
} from '@/entities/notification';

interface NotificationsViewProps {
  workspaceId: string;
  viewerId: string;
  initialData: NotificationPageData;
}

function getNotificationIcon(type: NotificationItem['type']) {
  const className = 'h-5 w-5 text-indigo-500';
  return type === 'announcement_created' ? (
    <Megaphone className={className} aria-hidden="true" />
  ) : (
    <ClipboardList className={className} aria-hidden="true" />
  );
}

function formatCreatedAt(value: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Seoul',
  }).format(new Date(value));
}

export function NotificationsView({ workspaceId, viewerId, initialData }: NotificationsViewProps) {
  // 사용자 전환 시 다른 사용자의 알림 캐시가 재사용되지 않도록 사용자 ID를 포함한 키입니다.
  const queryKey = useMemo(
    () => [...notificationsQueryKey(workspaceId, viewerId), 'history'] as const,
    [viewerId, workspaceId],
  );
  const queryClient = useQueryClient();
  const notificationQuery = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => getNotificationsPage({ workspaceId, offset: pageParam }),
    initialPageParam: 0,
    initialData: {
      pages: [initialData],
      pageParams: [0],
    },
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.flatMap((page) => page.notifications).length : undefined,
  });
  const markReadMutation = useMutation({
    mutationFn: (notificationIds?: string[]) => markNotificationsRead({ workspaceId, notificationIds }),
    onSuccess: (result) => {
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      void queryClient.invalidateQueries({ queryKey });
      void queryClient.invalidateQueries({
        queryKey: notificationsQueryKey(workspaceId, viewerId),
      });
    },
    onError: () => toast.error('알림 읽음 처리에 실패했습니다.'),
  });
  const notifications = notificationQuery.data.pages.flatMap((page) => page.notifications);

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">전체 알림</h1>
          <p className="mt-1 text-sm text-slate-500">워크스페이스에서 받은 활동 알림을 확인합니다.</p>
        </div>
        <button
          type="button"
          disabled={notifications.every((notification) => notification.readAt)}
          onClick={() => markReadMutation.mutate(undefined)}
          className="flex h-10 shrink-0 items-center gap-2 rounded-xl border border-indigo-100 px-3 text-sm font-bold text-indigo-600 hover:bg-indigo-50 disabled:border-slate-100 disabled:text-slate-300"
        >
          <CheckCheck className="h-4 w-4" aria-hidden="true" />
          전체 읽음
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {notifications.length === 0 && !notificationQuery.isPending ? (
          <p className="px-5 py-12 text-center text-sm text-slate-500">수신한 알림이 없습니다.</p>
        ) : (
          <ul>
            {notifications.map((notification) => (
              <li key={notification.id}>
                <Link
                  href={notification.linkPath}
                  onClick={() => {
                    if (!notification.readAt) markReadMutation.mutate([notification.id]);
                  }}
                  className={`flex gap-4 border-b border-slate-100 px-5 py-4 last:border-b-0 hover:bg-slate-50 ${
                    notification.readAt ? 'opacity-70' : 'bg-indigo-50/40'
                  }`}
                >
                  <span className="mt-1">{getNotificationIcon(notification.type)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-slate-800">{notification.title}</span>
                    {notification.body ? (
                      <span className="mt-1 block truncate text-sm text-slate-500">{notification.body}</span>
                    ) : null}
                    <time className="mt-2 block text-xs text-slate-400" dateTime={notification.createdAt}>
                      {formatCreatedAt(notification.createdAt)}
                    </time>
                  </span>
                  {!notification.readAt ? <span className="mt-2 h-2 w-2 rounded-full bg-indigo-500" /> : null}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {notificationQuery.hasNextPage ? (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            disabled={notificationQuery.isFetchingNextPage}
            onClick={() => void notificationQuery.fetchNextPage()}
            className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {notificationQuery.isFetchingNextPage ? '알림을 불러오는 중' : '이전 알림 더 보기'}
          </button>
        </div>
      ) : null}
    </section>
  );
}
