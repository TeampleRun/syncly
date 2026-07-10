'use client';

// 팀원 초대 섹션 — 이메일/초대 링크 모드를 토글로 전환한다.
import { useState } from 'react';
import { Check, Copy, Link2, UserRoundPlus } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { InviteMode } from '../model/use-member-management';

interface MemberInviteSectionProps {
  inviteMode: InviteMode;
  onChangeInviteMode: (mode: InviteMode) => void;
  email: string;
  onChangeEmail: (email: string) => void;
  canInvite: boolean;
  isDuplicate: boolean;
  onInviteByEmail: () => void;
  inviteLink: string;
}

const INVITE_MODES: { key: InviteMode; label: string }[] = [
  { key: 'email', label: '이메일' },
  { key: 'link', label: '초대 링크' },
];

export function MemberInviteSection({
  inviteMode,
  onChangeInviteMode,
  email,
  onChangeEmail,
  canInvite,
  isDuplicate,
  onInviteByEmail,
  inviteLink,
}: MemberInviteSectionProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // 클립보드 접근이 차단된 환경에서는 조용히 무시한다.
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-base font-bold text-slate-950">팀원 초대</h2>

      <div className="mt-4 inline-flex rounded-full bg-slate-100 p-1">
        {INVITE_MODES.map((mode) => {
          const isActive = mode.key === inviteMode;

          return (
            <button
              key={mode.key}
              type="button"
              onClick={() => onChangeInviteMode(mode.key)}
              aria-pressed={isActive}
              className={cn(
                'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800',
              )}
            >
              {mode.label}
            </button>
          );
        })}
      </div>

      {inviteMode === 'email' ? (
        <form
          className="mt-4 flex items-center gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            onInviteByEmail();
          }}
        >
          <label className="flex-1">
            <span className="sr-only">초대할 이메일</span>
            <input
              type="email"
              value={email}
              onChange={(event) => onChangeEmail(event.target.value)}
              placeholder="초대할 이메일"
              aria-invalid={isDuplicate || undefined}
              className="h-11 w-full rounded-2xl bg-slate-100 px-4 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-300"
            />
          </label>
          <button
            type="submit"
            disabled={!canInvite}
            className="flex h-11 shrink-0 items-center gap-2 rounded-2xl bg-[var(--color-brand)] px-5 text-sm font-bold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <UserRoundPlus className="h-4 w-4" aria-hidden="true" />
            초대
          </button>
        </form>
      ) : (
        <div className="mt-4 flex items-center gap-3">
          <div className="flex h-11 flex-1 items-center gap-2 rounded-2xl border border-slate-200 px-4 text-sm text-slate-600">
            <Link2 className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
            <span className="truncate">{inviteLink}</span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="flex h-11 shrink-0 items-center gap-2 rounded-2xl bg-[var(--color-brand)] px-5 text-sm font-bold text-white hover:bg-indigo-500"
          >
            {isCopied ? (
              <Check className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Copy className="h-4 w-4" aria-hidden="true" />
            )}
            {isCopied ? '복사됨' : '복사'}
          </button>
        </div>
      )}

      <p className="mt-3 text-sm text-slate-500">
        {inviteMode === 'email'
          ? '아직 가입하지 않은 사용자는 가입 시 자동으로 연결됩니다.'
          : '링크를 아는 사람은 누구나 이 워크스페이스에 참여할 수 있어요.'}
      </p>
      {inviteMode === 'email' && isDuplicate ? (
        <p className="mt-1 text-sm font-medium text-rose-500">이미 초대된 이메일이에요.</p>
      ) : null}
    </section>
  );
}
