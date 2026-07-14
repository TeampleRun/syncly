'use client';

// 초대 수락 화면 — 워크스페이스 요약을 보여주고 "참여하기"로 멤버 등록 후 워크스페이스로 이동한다.
// 참여는 joinWorkspaceByInviteCode 서버액션을 호출하며, 이미 멤버여도 멱등하게 입장한다.
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { joinWorkspaceByInviteCode } from '@/entities/workspace';
import { plusJakartaSans } from '@/shared/lib/fonts';

interface InviteAcceptViewProps {
  code: string;
  workspaceName: string;
  memberCount: number;
}

export function InviteAcceptView({ code, workspaceName, memberCount }: InviteAcceptViewProps) {
  const router = useRouter();
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async () => {
    setIsJoining(true);
    try {
      const { workspaceId } = await joinWorkspaceByInviteCode(code);
      // 참여 성공 시 워크스페이스로 이동한다. 이동으로 언마운트되므로 isJoining은 리셋하지 않는다.
      router.push(`/workspaces/${workspaceId}`);
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error
          ? error.message
          : '워크스페이스 참여에 실패했습니다. 잠시 후 다시 시도해주세요.',
      );
      setIsJoining(false);
    }
  };

  return (
    <div className={`${plusJakartaSans.className} flex min-h-dvh items-center justify-center px-4`}>
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-medium text-slate-500">워크스페이스 초대</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-950">{workspaceName}</h1>
        <p className="mt-2 text-sm text-slate-500">
          현재 멤버 {memberCount}명이 함께하고 있어요.
        </p>

        <button
          type="button"
          onClick={handleJoin}
          disabled={isJoining}
          className="mt-8 h-11 w-full rounded-2xl bg-[var(--color-brand)] px-5 text-sm font-bold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isJoining ? '참여하는 중…' : '참여하기'}
        </button>
      </section>
    </div>
  );
}
