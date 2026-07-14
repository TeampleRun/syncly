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
  isSendingInvite: boolean;
  inviteLink: string;
  isInviteEnabled: boolean;
  isTogglingInvite: boolean;
  onToggleInviteEnabled: () => void;
  canManageInvite: boolean;
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
  isSendingInvite,
  inviteLink,
  isInviteEnabled,
  isTogglingInvite,
  onToggleInviteEnabled,
  canManageInvite,
}: MemberInviteSectionProps) {
  const [isCopied, setIsCopied] = useState(false);

  const canCopy = isInviteEnabled && inviteLink.length > 0;

  const handleCopy = async () => {
    if (!canCopy) {
      return;
    }

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
            {isSendingInvite ? '보내는 중…' : '초대'}
          </button>
        </form>
      ) : (
        <>
          <div className="mt-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-slate-900">초대 링크 활성화</p>
              <p className="text-sm text-slate-500">
                {canManageInvite
                  ? '켜면 링크를 아는 사람이 워크스페이스에 참여할 수 있어요.'
                  : '초대 링크는 워크스페이스 소유자만 변경할 수 있어요.'}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isInviteEnabled}
              onClick={onToggleInviteEnabled}
              disabled={isTogglingInvite || !canManageInvite}
              className={cn(
                'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50',
                isInviteEnabled ? 'bg-[var(--color-brand)]' : 'bg-slate-200',
              )}
            >
              <span className="sr-only">초대 링크 활성화</span>
              <span
                className={cn(
                  'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform',
                  isInviteEnabled ? 'translate-x-5' : 'translate-x-0.5',
                )}
              />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div
              className={cn(
                'flex h-11 flex-1 items-center gap-2 rounded-2xl border px-4 text-sm',
                canCopy ? 'border-slate-200 text-slate-600' : 'border-slate-100 text-slate-300',
              )}
            >
              <Link2 className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
              <span className="truncate">
                {isInviteEnabled ? inviteLink : '초대 링크가 비활성화되어 있어요.'}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!canCopy}
              className="flex h-11 shrink-0 items-center gap-2 rounded-2xl bg-[var(--color-brand)] px-5 text-sm font-bold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCopied ? (
                <Check className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Copy className="h-4 w-4" aria-hidden="true" />
              )}
              {isCopied ? '복사됨' : '복사'}
            </button>
          </div>
        </>
      )}

      {inviteMode === 'email' ? (
        <p className="mt-3 text-sm text-slate-500">
          입력한 이메일로 초대 링크를 보내드려요. 초대 링크가 활성화되어 있어야 발송됩니다.
        </p>
      ) : null}
      {inviteMode === 'email' && isDuplicate ? (
        <p className="mt-1 text-sm font-medium text-rose-500">이미 참여 중인 멤버예요.</p>
      ) : null}
    </section>
  );
}
