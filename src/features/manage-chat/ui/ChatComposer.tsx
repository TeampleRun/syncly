'use client';

// 파일 첨부 없이 텍스트 메시지 작성과 전송만 제공하는 채팅 입력 영역입니다.
import { Send } from 'lucide-react';

interface ChatComposerProps {
  draft: string;
  isSending: boolean;
  onDraftChange: (value: string) => void;
  onSend: () => void;
}

export function ChatComposer({ draft, isSending, onDraftChange, onSend }: ChatComposerProps) {
  // 공백만 있는 메시지와 전송 중 중복 요청을 막는 전송 가능 여부입니다.
  const canSend = draft.trim().length > 0 && !isSending;

  return (
    <form
      className="border-t border-slate-100 bg-white p-4 sm:p-5"
      onSubmit={(event) => {
        event.preventDefault();
        onSend();
      }}
    >
      <label className="sr-only" htmlFor="chat-message-input">
        메시지 입력
      </label>
      <div className="flex items-end gap-3 rounded-2xl bg-slate-100 p-2 pl-4 focus-within:ring-2 focus-within:ring-indigo-300">
        <textarea
          id="chat-message-input"
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          onKeyDown={(event) => {
            // 한글 IME 조합 중 Enter는 마지막 음절을 확정하는 용도이므로 전송하면 안 됩니다.
            if (event.nativeEvent.isComposing) return;

            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              if (canSend) onSend();
            }
          }}
          placeholder="메시지를 입력하세요"
          maxLength={2000}
          rows={1}
          className="max-h-28 min-h-10 flex-1 resize-none bg-transparent py-2 text-sm leading-5 text-slate-800 outline-none placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={!canSend}
          aria-label="메시지 전송"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-brand)] text-white shadow-sm hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <p className="mt-2 px-1 text-xs text-slate-400">Enter로 전송 · Shift + Enter로 줄바꿈</p>
    </form>
  );
}
