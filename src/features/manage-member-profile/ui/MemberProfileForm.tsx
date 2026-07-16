'use client';

// 프로필 탭 — 닉네임 수정 및 팀 탈퇴
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/shared/ui/dialog';
import {
  updateMyNickname,
  workspaceMembersByWorkspaceQueryKey,
  leaveWorkspace,
} from '@/entities/workspace-member';

interface MemberProfileFormProps {
  workspaceId: string;
  initialNickname: string;
  isOwner: boolean;
}

export function MemberProfileForm({
  workspaceId,
  initialNickname,
  isOwner,
}: MemberProfileFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [committedNickname, setCommittedNickname] = useState(initialNickname);
  const [nickname, setNickname] = useState(initialNickname);
  const [isSaved, setIsSaved] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  // updateMyNickname은 실패 시 throw 하므로 onSuccess/onError로 깔끔하게 분기할 수 있다.
  const updateMutation = useMutation({
    mutationFn: updateMyNickname,
    onSuccess: async (_data, { nickname: savedNickname }) => {
      // 멤버 목록·스프린트·워크스케줄 등 공유 캐시를 쓰는 화면이 변경된 닉네임을 반영하도록 무효화한다.
      await queryClient.invalidateQueries({
        queryKey: workspaceMembersByWorkspaceQueryKey(workspaceId),
      });
      setNickname(savedNickname);
      setCommittedNickname(savedNickname);
      setIsSaved(true);
    },
    onError: (error) => {
      console.error(error);
      toast.error(
        error instanceof Error
          ? error.message
          : '닉네임 저장에 실패했습니다. 잠시 후 다시 시도해주세요.',
      );
    },
  });

  const isDirty = nickname !== committedNickname;
  const canSubmit = nickname.trim().length > 0 && isDirty && !updateMutation.isPending;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    updateMutation.mutate({ workspaceId, nickname: nickname.trim() });
  };

  const handleLeave = async () => {
    setIsLeaving(true);
    try {
      await leaveWorkspace({ workspaceId });
      router.push('/workspaces');
      // 성공 시 페이지 이동으로 언마운트되므로 isLeaving을 리셋하지 않는다(버튼 깜빡임 방지)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : '팀 탈퇴에 실패했어요. 잠시 후 다시 시도해주세요.',
      );
      setShowLeaveConfirm(false);
      setIsLeaving(false);
    }
  };

  return (
    <div className="space-y-6">
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
              {updateMutation.isPending ? '저장 중…' : '저장'}
            </button>
            {isSaved && !isDirty ? (
              <span className="text-sm font-medium text-emerald-600">저장되었습니다.</span>
            ) : null}
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-950">팀 탈퇴</h2>
        <p className="mt-1 text-sm text-slate-500">
          {isOwner
            ? '워크스페이스 소유자는 팀을 탈퇴할 수 없어요. 소유권을 이전한 후 탈퇴해주세요.'
            : '탈퇴하면 이 워크스페이스에서 나가게 되며, 데이터를 복구할 수 없어요.'}
        </p>

        <button
          type="button"
          disabled={isOwner}
          onClick={() => setShowLeaveConfirm(true)}
          className="mt-4 h-10 rounded-2xl border border-slate-200 px-5 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          탈퇴하기
        </button>

        <Dialog
          open={showLeaveConfirm}
          onOpenChange={(open) => !isLeaving && setShowLeaveConfirm(open)}
        >
          <DialogContent className="p-6 sm:max-w-[380px]">
            <DialogTitle className="font-bold">정말 탈퇴하시겠어요?</DialogTitle>
            <DialogDescription>
              탈퇴하면 이 워크스페이스에서 나가게 되며,
              <br />
              데이터를 복구할 수 없어요.
            </DialogDescription>
            <DialogFooter className="mx-0 mb-0 border-t-0 bg-transparent p-0 pt-2">
              <button
                type="button"
                onClick={() => setShowLeaveConfirm(false)}
                disabled={isLeaving}
                className="h-10 rounded-2xl border border-slate-200 px-5 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleLeave}
                disabled={isLeaving}
                className="flex h-10 items-center justify-center rounded-2xl bg-red-500 px-5 text-sm font-bold text-white hover:bg-red-600 disabled:opacity-50"
              >
                {isLeaving ? <Loader2 size={18} className="animate-spin" /> : '탈퇴하기'}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
    </div>
  );
}
