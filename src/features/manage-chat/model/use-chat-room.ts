'use client';

// TanStack Query 캐시와 Supabase Realtime 구독을 연결해 채팅방 상태를 관리합니다.
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  chatRoomQueryKey,
  getChatRoom,
  sendChatMessage,
  type ChatMessage,
  type ChatRoomData,
} from '@/entities/chat';
import { getSupabaseBrowserClient } from '@/shared/api/supabase/client';
import type { GenericTables } from '@/shared/model/supabase.types';

type ChatMessageRow = GenericTables<'chat_messages'>;
const CHAT_MESSAGE_LIMIT = 50;

function mergeMessage(
  data: ChatRoomData | undefined,
  message: ChatMessage,
): ChatRoomData | undefined {
  if (!data) return data;

  // 같은 UUID의 낙관적 메시지는 실제 DB 행으로 교체하고, 캐시는 시간순 최근 50개만 유지합니다.
  const messages = [...data.messages.filter((item) => item.id !== message.id), message]
    .sort((left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime())
    .slice(-CHAT_MESSAGE_LIMIT);

  return { ...data, messages };
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
  // 비동기 전송 중 새로 입력한 draft를 보존하기 위한 최신 입력값 참조입니다.
  const draftRef = useRef('');
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

  const updateDraft = (value: string) => {
    draftRef.current = value;
    setDraft(value);
  };

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
            return mergeMessage(
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
    const content = draftRef.current.trim();
    if (!content || isSendingRef.current) return;

    isSendingRef.current = true;
    // 서버·Realtime·낙관적 캐시가 같은 행으로 식별할 클라이언트 생성 UUID입니다.
    const messageId = crypto.randomUUID();
    const temporaryMessage: ChatMessage = {
      id: messageId,
      workspaceId,
      senderId: data.viewer?.userId ?? null,
      senderName:
        data.participants.find((participant) => participant.userId === data.viewer?.userId)?.name ??
        '나',
      content,
      createdAt: new Date().toISOString(),
    };

    queryClient.setQueryData<ChatRoomData>(chatRoomQueryKey(workspaceId), (currentData) =>
      mergeMessage(currentData, temporaryMessage),
    );
    updateDraft('');

    const removeOptimisticMessage = () => {
      queryClient.setQueryData<ChatRoomData>(chatRoomQueryKey(workspaceId), (currentData) =>
        currentData
          ? {
              ...currentData,
              messages: currentData.messages.filter((item) => item.id !== messageId),
            }
          : currentData,
      );

      // 전송 뒤 새 입력이 없을 때만 실패한 내용을 복원해 사용자의 새 입력을 덮어쓰지 않습니다.
      if (draftRef.current === '') updateDraft(content);
    };

    try {
      const result = await sendMutation.mutateAsync({ messageId, workspaceId, content });
      if (!result.ok) {
        removeOptimisticMessage();
        toast.error(result.message);
        return;
      }

      // Realtime이 먼저 도착해도 같은 UUID의 낙관적 메시지를 실제 DB 행으로 교체합니다.
      queryClient.setQueryData<ChatRoomData>(chatRoomQueryKey(workspaceId), (currentData) =>
        mergeMessage(currentData, result.data),
      );
    } catch {
      removeOptimisticMessage();
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
    setDraft: updateDraft,
    sendMessage,
    isSending: sendMutation.isPending,
    isLoading: isPending,
    connectionStatus,
  };
}
