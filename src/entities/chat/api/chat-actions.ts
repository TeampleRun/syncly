'use server';

// 채팅 메시지를 현재 로그인한 워크스페이스 멤버 명의로 저장합니다.
import { z } from 'zod';
import { getCurrentUserId } from '@/shared/api/supabase/current-user';
import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import type { ChatMessage } from '../model/chat.types';

const uuidSchema = z.guid();
const chatMessageSchema = z.object({
  // 낙관적 메시지와 DB·Realtime 메시지를 같은 행으로 식별하기 위한 클라이언트 생성 UUID입니다.
  messageId: uuidSchema,
  workspaceId: uuidSchema,
  content: z.string().trim().min(1, '메시지를 입력해주세요.').max(2_000),
});

export type ChatActionResult<T> = { ok: true; data: T } | { ok: false; message: string };

class ChatActionError extends Error {}

function throwChatActionError(message: string): never {
  throw new ChatActionError(message);
}

function toActionFailure(error: unknown, fallbackMessage: string): ChatActionResult<never> {
  if (error instanceof ChatActionError) return { ok: false, message: error.message };

  console.error('[chat action] 예상하지 못한 오류:', error);
  return { ok: false, message: fallbackMessage };
}

async function getCurrentWorkspaceMember(workspaceId: string) {
  const supabase = await createSupabaseServerClient();
  const currentUserId = await getCurrentUserId();
  const { data: member, error } = await supabase
    .from('workspace_members')
    .select('user_id, workspace_nickname')
    .eq('workspace_id', workspaceId)
    .eq('user_id', currentUserId)
    .maybeSingle();

  if (error) {
    console.error('[chat action] 워크스페이스 멤버 확인 실패:', error);
    throwChatActionError('워크스페이스 멤버 정보를 확인하지 못했습니다.');
  }

  if (!member) throwChatActionError('워크스페이스 멤버만 메시지를 보낼 수 있습니다.');

  return { supabase, member };
}

export async function sendChatMessage(input: {
  messageId: string;
  workspaceId: string;
  content: string;
}): Promise<ChatActionResult<ChatMessage>> {
  try {
    const value = chatMessageSchema.parse(input);
    const { supabase, member } = await getCurrentWorkspaceMember(value.workspaceId);
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        id: value.messageId,
        workspace_id: value.workspaceId,
        sender_id: member.user_id,
        content: value.content,
      })
      .select('id, workspace_id, sender_id, content, created_at')
      .single();

    if (error) {
      console.error('[chat action] 메시지 저장 실패:', error);
      throwChatActionError('메시지 전송에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }

    return {
      ok: true,
      data: {
        id: data.id,
        workspaceId: data.workspace_id,
        senderId: data.sender_id,
        senderName: member.workspace_nickname || '사용자',
        content: data.content,
        createdAt: data.created_at,
      },
    };
  } catch (error) {
    return toActionFailure(error, '메시지 전송에 실패했습니다. 입력값을 확인해주세요.');
  }
}
