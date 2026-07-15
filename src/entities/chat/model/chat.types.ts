// 채팅 화면과 Realtime 구독에서 공통으로 사용하는 워크스페이스 메시지 형태입니다.
export interface ChatMessage {
  id: string;
  workspaceId: string;
  senderId: string | null;
  senderName: string;
  content: string;
  createdAt: string;
}

// 채팅 보조 패널에 표시할 워크스페이스 참여자 정보입니다.
export interface ChatParticipant {
  userId: string;
  name: string;
}

// 현재 사용자의 메시지 정렬과 전송 권한에 사용하는 최소 멤버 정보입니다.
export interface ChatViewer {
  userId: string;
  role: 'owner' | 'member';
}

// 초기 조회와 TanStack Query 캐시에 저장할 채팅방 단위 데이터입니다.
export interface ChatRoomData {
  messages: ChatMessage[];
  participants: ChatParticipant[];
  viewer: ChatViewer | null;
}
