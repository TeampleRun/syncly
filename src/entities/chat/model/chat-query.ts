// 워크스페이스마다 독립적인 채팅 캐시와 Realtime 이벤트를 연결하는 Query Key입니다.
export const chatRoomQueryKey = (workspaceId: string) => ['chat-room', workspaceId] as const;
