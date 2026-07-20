// 사용자별 알림 목록과 읽지 않은 개수를 격리해 갱신하기 위한 Query 키입니다.
export const notificationsQueryKey = (workspaceId: string, viewerId: string) =>
  ['notifications', workspaceId, viewerId] as const;
