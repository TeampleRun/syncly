'use client';

// 메시지를 발신자 기준 말풍선으로 렌더링하고 새 메시지 도착 시 하단으로 스크롤합니다.
import { useEffect, useRef } from 'react';
import type { ChatMessage } from '@/entities/chat';
import { cn } from '@/shared/lib/utils';

interface ChatMessageListProps {
  messages: ChatMessage[];
  viewerId: string | null;
  isLoading: boolean;
}

function formatMessageTime(createdAt: string): string {
  // DB의 UTC 시간을 한국 표준시로 고정 변환해 서버와 브라우저의 로케일 차이를 없앱니다.
  const date = new Date(createdAt);
  const koreaHour = (date.getUTCHours() + 9) % 24;
  const minute = String(date.getUTCMinutes()).padStart(2, '0');
  const period = koreaHour < 12 ? '오전' : '오후';
  const displayHour = koreaHour % 12 || 12;

  return `${period} ${displayHour}:${minute}`;
}

function getAvatarLabel(name: string): string {
  return name.slice(0, 1) || '?';
}

export function ChatMessageList({ messages, viewerId, isLoading }: ChatMessageListProps) {
  // 새 메시지 전송·수신 뒤 최근 대화를 보이게 하는 스크롤 기준 요소입니다.
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [messages.length]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-slate-400">
        메시지를 불러오는 중입니다.
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <p className="text-base font-bold text-slate-700">아직 대화가 없습니다.</p>
        <p className="mt-1 text-sm text-slate-400">첫 메시지로 워크스페이스 대화를 시작해보세요.</p>
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-7">
      <div className="space-y-5">
        {messages.map((message) => {
          const isOwnMessage = message.senderId === viewerId;

          return (
            <div
              key={message.id}
              className={cn('flex items-end gap-3', isOwnMessage ? 'justify-end' : 'justify-start')}
            >
              {!isOwnMessage ? (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
                  {getAvatarLabel(message.senderName)}
                </div>
              ) : null}
              <div className={cn('max-w-[80%] sm:max-w-[70%]', isOwnMessage && 'items-end')}>
                <div
                  className={cn(
                    'mb-1 flex items-center gap-2 text-xs font-medium text-slate-400',
                    isOwnMessage && 'justify-end',
                  )}
                >
                  <span>{message.senderName}</span>
                  <time dateTime={message.createdAt}>{formatMessageTime(message.createdAt)}</time>
                </div>
                <p
                  className={cn(
                    'w-fit rounded-2xl px-4 py-3 text-sm leading-6 whitespace-pre-wrap',
                    isOwnMessage
                      ? 'ml-auto rounded-br-md bg-[var(--color-brand)] text-white'
                      : 'rounded-bl-md bg-slate-100 text-slate-800',
                  )}
                >
                  {message.content}
                </p>
              </div>
              {isOwnMessage ? (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-400 text-sm font-bold text-white">
                  {getAvatarLabel(message.senderName)}
                </div>
              ) : null}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
