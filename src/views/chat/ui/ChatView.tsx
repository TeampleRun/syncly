'use client';

// 넓은 채팅 영역과 워크스페이스 참여자 보조 패널을 조합하는 채팅 페이지 화면입니다.
import { MessageCircleMore, UsersRound } from 'lucide-react';
import type { ChatRoomData } from '@/entities/chat';
import { ChatComposer, ChatMessageList, useChatRoom } from '@/features/manage-chat';
import { getAvatarColor } from '@/shared/lib/avatar-color';

interface ChatViewProps {
  workspaceId: string;
  initialData: ChatRoomData;
}

function getAvatarLabel(name: string): string {
  return name.slice(0, 1) || '?';
}

function getConnectionLabel(status: string): { label: string; className: string } {
  if (status === 'SUBSCRIBED') {
    return { label: '실시간 연결', className: 'bg-emerald-50 text-emerald-600' };
  }

  if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
    return { label: '연결 재시도 중', className: 'bg-amber-50 text-amber-600' };
  }

  return { label: '연결 중', className: 'bg-slate-100 text-slate-500' };
}

export function ChatView({ workspaceId, initialData }: ChatViewProps) {
  // 서버 초기 데이터와 Realtime INSERT 이벤트를 함께 관리하는 채팅방 상태입니다.
  const {
    messages,
    participants,
    viewer,
    draft,
    setDraft,
    sendMessage,
    isSending,
    isLoading,
    connectionStatus,
  } = useChatRoom({ workspaceId, initialData });
  // 실제 Realtime 채널 상태를 기반으로 한 상단 연결 상태 표시값입니다.
  const connection = getConnectionLabel(connectionStatus);

  return (
    <section className="mx-auto w-full min-w-0 max-w-[1180px]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-950">채팅</h1>
        <p className="mt-1 text-sm text-slate-500">
          워크스페이스 구성원과 실시간으로 대화할 수 있습니다.
        </p>
      </div>

      <div className="grid min-h-[calc(100vh-230px)] min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(220px,0.32fr)]">
        <div className="flex h-[min(720px,calc(100dvh-230px))] min-h-[480px] min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-[var(--color-brand)]">
                <MessageCircleMore className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">전체 대화</h2>
                <p className="text-xs text-slate-400">최근 메시지 {messages.length}개</p>
              </div>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${connection.className}`}>
              {connection.label}
            </span>
          </div>

          <ChatMessageList
            messages={messages}
            viewerId={viewer?.userId ?? null}
            isLoading={isLoading}
          />
          <ChatComposer
            draft={draft}
            isSending={isSending}
            onDraftChange={setDraft}
            onSend={() => void sendMessage()}
          />
        </div>

        <aside className="flex min-w-0 flex-col gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <UsersRound className="h-5 w-5 text-[var(--color-brand)]" aria-hidden="true" />
              <h2 className="font-bold text-slate-900">참여 멤버</h2>
              <span className="ml-auto text-sm font-bold text-indigo-500">
                {participants.length}
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {participants.slice(0, 8).map((participant) => (
                <div key={participant.userId} className="flex items-center gap-3">
                  <div
                    style={{ backgroundColor: getAvatarColor(participant.userId) }}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                  >
                    {getAvatarLabel(participant.name)}
                  </div>
                  <p className="truncate text-sm font-medium text-slate-700">{participant.name}</p>
                  {participant.userId === viewer?.userId ? (
                    <span className="ml-auto text-xs font-bold text-indigo-500">나</span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-indigo-50 p-5 text-sm leading-6 text-indigo-800">
            <p className="font-bold">대화 안내</p>
            <p className="mt-2 text-indigo-600">
              전송한 메시지는 워크스페이스 구성원에게 바로 공유됩니다.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
