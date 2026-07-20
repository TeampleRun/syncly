// 헤더 알림 목록과 읽음 처리에서 공통으로 사용하는 알림 도메인 타입입니다.
export type NotificationType = 'announcement_created' | 'task_assigned' | 'task_status_changed';

export interface NotificationItem {
  id: string;
  workspaceId: string;
  type: NotificationType;
  title: string;
  body: string | null;
  linkPath: string;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationData {
  notifications: NotificationItem[];
  unreadCount: number;
}

// 전체 알림 화면에서 다음 목록을 이어서 조회하기 위한 페이지 단위 데이터입니다.
export interface NotificationPageData {
  notifications: NotificationItem[];
  hasMore: boolean;
}

export type NotificationActionResult<T> = { ok: true; data: T } | { ok: false; message: string };
