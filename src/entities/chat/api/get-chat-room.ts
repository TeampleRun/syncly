'use server';

// 워크스페이스 채팅방의 최근 메시지와 참여자 정보를 서버에서 함께 조회합니다.
import { z } from 'zod';
import { getCurrentUserId } from '@/shared/api/supabase/current-user';
import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import type { ChatMessage, ChatRoomData } from '../model/chat.types';

// 초기 화면 부하를 제한하는 최근 메시지 조회 개수입니다. 이전 기록은 후속 페이지네이션으로 확장합니다.
const CHAT_MESSAGE_PAGE_SIZE = 50;
const workspaceIdSchema = z.guid();

export async function getChatRoom(workspaceId: string): Promise<ChatRoomData> {
  const parsedWorkspaceId = workspaceIdSchema.parse(workspaceId);
  const supabase = await createSupabaseServerClient();
  const currentUserId = await getCurrentUserId();

  const [{ data: messages, error: messageError }, { data: members, error: memberError }] =
    await Promise.all([
      supabase
        .from('chat_messages')
        .select('id, workspace_id, sender_id, content, created_at')
        .eq('workspace_id', parsedWorkspaceId)
        .order('created_at', { ascending: false })
        .limit(CHAT_MESSAGE_PAGE_SIZE),
      supabase
        .from('workspace_members')
        .select('user_id, workspace_nickname, role')
        .eq('workspace_id', parsedWorkspaceId)
        .order('joined_at', { ascending: true }),
    ]);

  if (messageError) throw new Error(`채팅 메시지 조회에 실패했습니다: ${messageError.message}`);
  if (memberError) throw new Error(`채팅 참여자 조회에 실패했습니다: ${memberError.message}`);

  // Realtime INSERT 이벤트에도 동일한 표시 이름을 즉시 붙이기 위한 멤버 이름 맵입니다.
  const participantNameById = new Map(
    (members ?? []).map((member) => [member.user_id, member.workspace_nickname || '사용자']),
  );
  const sortedMessages = [...(messages ?? [])].reverse();

  return {
    messages: sortedMessages.map((message): ChatMessage => ({
      id: message.id,
      workspaceId: message.workspace_id,
      senderId: message.sender_id,
      senderName: message.sender_id
        ? (participantNameById.get(message.sender_id) ?? '알 수 없음')
        : '탈퇴한 사용자',
      content: message.content,
      createdAt: message.created_at,
    })),
    participants: (members ?? []).map((member) => ({
      userId: member.user_id,
      name: member.workspace_nickname || '사용자',
    })),
    viewer: (() => {
      const currentMember = (members ?? []).find((member) => member.user_id === currentUserId);
      return currentMember ? { userId: currentMember.user_id, role: currentMember.role } : null;
    })(),
  };
}
