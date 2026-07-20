'use client';

// 헤더 종 아이콘에서 최근 알림, 읽지 않은 개수, 읽음 처리 명령을 표시합니다.
import { Bell, CheckCheck, ClipboardList, Megaphone } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import type { NotificationItem } from '@/entities/notification';
import { useWorkspaceNotifications } from '../model/use-workspace-notifications';

interface NotificationPanelProps {
  workspaceId: string;
  viewerId: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

function getNotificationIcon(type: NotificationItem['type']) {
  const className = 'h-4 w-4 text-indigo-500';
  if (type === 'announcement_created')
    return <Megaphone className={className} aria-hidden="true" />;
  return <ClipboardList className={className} aria-hidden="true" />;
}

function formatCreatedAt(value: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Seoul',
  }).format(new Date(value));
}

export function NotificationPanel({
  workspaceId,
  viewerId,
  isOpen,
  onOpenChange,
}: NotificationPanelProps) {
  const { notifications, unreadCount, isLoading, isError, markOneAsRead, markAllAsRead } =
    useWorkspaceNotifications({ workspaceId, viewerId });

  const markAll = async () => {
    const result = await markAllAsRead();
    if (!result.ok) toast.error(result.message);
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    onOpenChange(false);
    if (notification.readAt) return;

    void markOneAsRead(notification.id).then((result) => {
      if (!result.ok) toast.error(result.message);
    });
  };

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="알림"
        aria-expanded={isOpen}
        onClick={() => onOpenChange(!isOpen)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 z-50 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <p className="text-sm font-bold text-slate-900">알림</p>
              <p className="text-xs text-slate-500">최근 알림 10개</p>
            </div>
            <button
              type="button"
              onClick={() => void markAll()}
              disabled={unreadCount === 0}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 disabled:text-slate-300"
            >
              <CheckCheck className="h-4 w-4" aria-hidden="true" />
              전체 읽음
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading && (
              <p className="px-4 py-5 text-sm text-slate-500">알림을 불러오는 중입니다.</p>
            )}
            {!isLoading && isError && (
              <p className="px-4 py-5 text-sm text-rose-600">알림을 불러오지 못했습니다.</p>
            )}
            {!isLoading && !isError && notifications.length === 0 && (
              <p className="px-4 py-5 text-sm text-slate-500">새 알림이 없습니다.</p>
            )}
            {notifications.map((notification) => (
              <Link
                key={notification.id}
                href={notification.linkPath}
                onClick={() => handleNotificationClick(notification)}
                className={`flex gap-3 border-b border-slate-100 px-4 py-3 last:border-0 hover:bg-slate-50 ${
                  notification.readAt ? 'opacity-70' : 'bg-indigo-50/40'
                }`}
              >
                <span className="mt-0.5">{getNotificationIcon(notification.type)}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-slate-800">
                    {notification.title}
                  </span>
                  {notification.body && (
                    <span className="mt-0.5 block truncate text-xs text-slate-500">
                      {notification.body}
                    </span>
                  )}
                  <time
                    className="mt-1 block text-xs text-slate-400"
                    dateTime={notification.createdAt}
                  >
                    {formatCreatedAt(notification.createdAt)}
                  </time>
                </span>
                {!notification.readAt && (
                  <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
