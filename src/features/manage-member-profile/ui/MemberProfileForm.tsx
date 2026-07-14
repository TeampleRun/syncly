'use client';

// 프로필 탭 — 현재 사용자의 워크스페이스 닉네임을 수정한다.
// 초기 닉네임은 서버(RSC)에서 주입받고, 저장은 updateMyNickname 서버액션을 호출한다.
import { useState } from 'react';
import { toast } from 'sonner';
import { updateMyNickname } from '@/entities/workspace-member';

interface MemberProfileFormProps {
  workspaceId: string;
  initialNickname: string;
}

export function MemberProfileForm({ workspaceId, initialNickname }: MemberProfileFormProps) {
  const [committedNickname, setCommittedNickname] = useState(initialNickname);
  const [nickname, setNickname] = useState(initialNickname);
  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDirty = nickname !== committedNickname;
  const canSubmit = nickname.trim().length > 0 && isDirty && !isSubmitting;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    const nextNickname = nickname.trim();

    setIsSubmitting(true);
    try {
      await updateMyNickname({ workspaceId, nickname: nextNickname });
      setNickname(nextNickname);
      setCommittedNickname(nextNickname);
      setIsSaved(true);
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error
          ? error.message
          : '닉네임 저장에 실패했습니다. 잠시 후 다시 시도해주세요.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-base font-bold text-slate-950">프로필</h2>
      <p className="mt-1 text-sm text-slate-500">
        이 워크스페이스에서 표시되는 닉네임을 수정할 수 있어요.
      </p>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm font-bold text-slate-900">닉네임</span>
          <input
            value={nickname}
            onChange={(event) => {
              setNickname(event.target.value);
              setIsSaved(false);
            }}
            placeholder="닉네임을 입력하세요."
            className="mt-2 h-11 w-full rounded-2xl bg-slate-100 px-4 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-300"
          />
        </label>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!canSubmit}
            className="h-10 rounded-2xl bg-[var(--color-brand)] px-5 text-sm font-bold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? '저장 중…' : '저장'}
          </button>
          {isSaved && !isDirty ? (
            <span className="text-sm font-medium text-emerald-600">저장되었습니다.</span>
          ) : null}
        </div>
      </form>
    </section>
  );
}
