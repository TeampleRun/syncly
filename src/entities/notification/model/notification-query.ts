// 워크스페이스별 알림 목록과 읽지 않은 개수를 함께 갱신하기 위한 Query 키입니다.
export const notificationsQueryKey = (workspaceId: string) =>
  ['notifications', workspaceId] as const;
