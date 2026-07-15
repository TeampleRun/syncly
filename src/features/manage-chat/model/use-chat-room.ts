'use client';

// TanStack Query 캐시와 Supabase Realtime 구독을 연결해 채팅방 상태를 관리합니다.
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { sendChatMessage } from '@/entities/chat/api/chat-actions';
import { getChatRoom } from '@/entities/chat/api/get-chat-room';
import { chatRoomQueryKey } from '@/entities/chat/model/chat-query';
import type { ChatMessage, ChatRoomData } from '@/entities/chat';
import { getSupabaseBrowserClient } from '@/shared/api/supabase/client';
import type { GenericTables } from '@/shared/model/supabase.types';

type ChatMessageRow = GenericTables<'chat_messages'>;

function appendMessage(
  data: ChatRoomData | undefined,
  message: ChatMessage,
): ChatRoomData | undefined {
  if (!data || data.messages.some((item) => item.id === message.id)) return data;

  return { ...data, messages: [...data.messages, message] };
}

function replaceMessage(
  data: ChatRoomData | undefined,
  temporaryMessageId: string,
  message: ChatMessage,
): ChatRoomData | undefined {
  if (!data) return data;

  const messagesWithoutTemporary = data.messages.filter((item) => item.id !== temporaryMessageId);
  if (messagesWithoutTemporary.some((item) => item.id === message.id)) {
    return { ...data, messages: messagesWithoutTemporary };
  }

  return { ...data, messages: [...messagesWithoutTemporary, message] };
}

function toRealtimeMessage(row: ChatMessageRow, data: ChatRoomData): ChatMessage {
  const participant = data.participants.find((item) => item.userId === row.sender_id);

  return {
    id: row.id,
    workspaceId: row.workspace_id,
    senderId: row.sender_id,
    senderName: participant?.name ?? (row.sender_id ? '알 수 없음' : '탈퇴한 사용자'),
    content: row.content,
    createdAt: row.created_at,
  };
}

interface UseChatRoomParams {
  workspaceId: string;
  initialData: ChatRoomData;
}

export function useChatRoom({ workspaceId, initialData }: UseChatRoomParams) {
  // 같은 워크스페이스의 채팅 데이터만 갱신하기 위한 TanStack Query 클라이언트입니다.
  const queryClient = useQueryClient();
  // 최초 조회 실패와 백그라운드 갱신 실패를 한 번만 알리기 위한 참조값입니다.
  const notifiedQueryError = useRef<Error | null>(null);
  // 사용자가 입력 중인 메시지 내용입니다.
  const [draft, setDraft] = useState('');
  // Supabase Realtime 채널의 실제 구독 상태를 UI에 전달합니다.
  const [connectionStatus, setConnectionStatus] = useState('CONNECTING');
  // React 상태 갱신 전 연속 Enter·클릭 이벤트가 중복 전송되는 것을 즉시 막는 잠금값입니다.
  const isSendingRef = useRef(false);
  const {
    data = initialData,
    error,
    isError,
    isPending,
    isRefetchError,
  } = useQuery({
    queryKey: chatRoomQueryKey(workspaceId),
    queryFn: () => getChatRoom(workspaceId),
    initialData,
  });
  const sendMutation = useMutation({ mutationFn: sendChatMessage });

  useEffect(() => {
    if (!error || (!isError && !isRefetchError)) {
      notifiedQueryError.current = null;
      return;
    }

    if (notifiedQueryError.current === error) return;

    notifiedQueryError.current = error;
    toast.error('채팅 메시지를 새로고침하지 못했습니다. 잠시 후 다시 시도해주세요.');
  }, [error, isError, isRefetchError]);

  useEffect(() => {
    // 워크스페이스 UUID를 채널명과 DB filter에 함께 사용해 다른 채팅방 이벤트를 분리한다.
    const supabase = getSupabaseBrowserClient();
    const channel = supabase
      .channel(`workspace-chat:${workspaceId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `workspace_id=eq.${workspaceId}`,
        },
        (payload) => {
          queryClient.setQueryData<ChatRoomData>(chatRoomQueryKey(workspaceId), (currentData) => {
            if (!currentData) return currentData;
            return appendMessage(
              currentData,
              toRealtimeMessage(payload.new as ChatMessageRow, currentData),
            );
          });
        },
      )
      .subscribe((status) => {
        setConnectionStatus(status);
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient, workspaceId]);

  const sendMessage = async () => {
    const content = draft.trim();
    if (!content || isSendingRef.current) return;

    isSendingRef.current = true;
    // 서버 왕복 전에 내 화면에 바로 표시할 임시 메시지입니다.
    const temporaryMessageId = `pending-${crypto.randomUUID()}`;
    const temporaryMessage: ChatMessage = {
      id: temporaryMessageId,
      workspaceId,
      senderId: data.viewer?.userId ?? null,
      senderName:
        data.participants.find((participant) => participant.userId === data.viewer?.userId)?.name ??
        '나',
      content,
      createdAt: new Date().toISOString(),
    };

    queryClient.setQueryData<ChatRoomData>(chatRoomQueryKey(workspaceId), (currentData) =>
      appendMessage(currentData, temporaryMessage),
    );
    setDraft('');

    try {
      const result = await sendMutation.mutateAsync({ workspaceId, content });
      if (!result.ok) {
        queryClient.setQueryData<ChatRoomData>(chatRoomQueryKey(workspaceId), (currentData) =>
          currentData
            ? {
                ...currentData,
                messages: currentData.messages.filter((item) => item.id !== temporaryMessageId),
              }
            : currentData,
        );
        toast.error(result.message);
        return;
      }

      // Realtime이 먼저 도착해도 id 중복 없이 임시 메시지만 실제 DB 행으로 교체한다.
      queryClient.setQueryData<ChatRoomData>(chatRoomQueryKey(workspaceId), (currentData) =>
        replaceMessage(currentData, temporaryMessageId, result.data),
      );
    } catch {
      queryClient.setQueryData<ChatRoomData>(chatRoomQueryKey(workspaceId), (currentData) =>
        currentData
          ? {
              ...currentData,
              messages: currentData.messages.filter((item) => item.id !== temporaryMessageId),
            }
          : currentData,
      );
      toast.error('메시지 전송에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      isSendingRef.current = false;
    }
  };

  return {
    messages: data.messages,
    participants: data.participants,
    viewer: data.viewer,
    draft,
    setDraft,
    sendMessage,
    isSending: sendMutation.isPending,
    isLoading: isPending,
    connectionStatus,
  };
}
