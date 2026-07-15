// 채팅 도메인이 상위 레이어에 제공하는 조회·저장 API와 타입 공개 진입점입니다.
export { getChatRoom } from './api/get-chat-room';
export { chatRoomQueryKey } from './model/chat-query';
export type { ChatMessage, ChatParticipant, ChatRoomData, ChatViewer } from './model/chat.types';
