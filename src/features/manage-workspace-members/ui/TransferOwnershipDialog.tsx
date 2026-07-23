'use client';

// 소유권 이전 확인 다이얼로그 — 다른 멤버 중 한 명을 선택해 소유권을 넘긴다.
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { transferOwnership } from '@/entities/workspace';
import type { WorkspaceMember } from '@/entities/workspace-member';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/shared/ui/dialog';

interface TransferOwnershipDialogProps {
  workspaceId: string;
  otherMembers: WorkspaceMember[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransferOwnershipDialog({
  workspaceId,
  otherMembers,
  open,
  onOpenChange,
}: TransferOwnershipDialogProps) {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);

  // otherMembers는 비동기로 갱신되거나 다이얼로그를 다시 열 때 바뀔 수 있어, 선택값이 더 이상
  // 목록에 없으면 렌더 시점에 첫 멤버로 대체한다(state에 직접 반영하진 않아 effect가 필요 없다).
  const effectiveSelectedUserId = otherMembers.some((member) => member.userId === selectedUserId)
    ? selectedUserId
    : (otherMembers[0]?.userId ?? '');

  const handleTransfer = async () => {
    if (!effectiveSelectedUserId) return;
    setIsTransferring(true);
    try {
      await transferOwnership({ workspaceId, newOwnerUserId: effectiveSelectedUserId });
      // router.refresh()는 사이드바 role 표시까지 확실히 갱신하지 못해 하드 리로드로 대체한다.
      window.location.reload();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : '소유권 이전에 실패했어요. 잠시 후 다시 시도해주세요.',
      );
      setIsTransferring(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !isTransferring && onOpenChange(next)}>
      <DialogContent className="p-6 sm:max-w-[380px]">
        <DialogTitle className="font-bold">소유권을 이전할 멤버를 선택하세요</DialogTitle>
        <DialogDescription>
          이전 후에는 되돌릴 수 없으며, 선택한 멤버가 새 워크스페이스 소유자가 돼요.
        </DialogDescription>

        <div className="mt-2 max-h-60 space-y-1 overflow-y-auto">
          {otherMembers.map((member) => (
            <label
              key={member.userId}
              className="flex items-center gap-3 rounded-2xl px-3 py-2 hover:bg-slate-50"
            >
              <input
                type="radio"
                name="new-owner"
                value={member.userId}
                checked={effectiveSelectedUserId === member.userId}
                onChange={() => setSelectedUserId(member.userId)}
                className="h-4 w-4"
              />
              <span className="text-sm font-medium text-slate-900">{member.workspaceNickname}</span>
            </label>
          ))}
        </div>

        <DialogFooter className="mx-0 mb-0 border-t-0 bg-transparent p-0 pt-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isTransferring}
            className="h-10 rounded-2xl border border-slate-200 px-5 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleTransfer}
            disabled={isTransferring || !effectiveSelectedUserId}
            aria-busy={isTransferring}
            className="flex h-10 items-center justify-center rounded-2xl bg-[var(--color-brand)] px-5 text-sm font-bold text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {isTransferring ? (
              <>
                <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                <span className="sr-only">이전 중</span>
              </>
            ) : (
              '이전하기'
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
