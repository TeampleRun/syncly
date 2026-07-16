// 알림 도메인이 헤더 기능에 제공하는 조회·읽음 API와 타입 공개 진입점입니다.
export { getNotifications } from './api/get-notifications';
export { markNotificationsRead } from './api/notification-actions';
export { notificationsQueryKey } from './model/notification-query';
export type {
  NotificationActionResult,
  NotificationData,
  NotificationItem,
  NotificationType,
} from './model/notification.types';
