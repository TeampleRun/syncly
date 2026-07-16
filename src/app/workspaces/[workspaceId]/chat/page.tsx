// 워크스페이스 채팅 페이지의 서버 진입점으로 초기 메시지를 조회해 클라이언트 화면에 전달합니다.
import { getChatRoom } from '@/entities/chat';
import { ChatView } from '@/views/chat';

interface ChatPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { workspaceId } = await params;
  const initialData = await getChatRoom(workspaceId);

  return <ChatView workspaceId={workspaceId} initialData={initialData} />;
}
