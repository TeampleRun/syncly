'use client';

// 워크스페이스 삭제 확인 다이얼로그 — 이름을 정확히 입력해야만 삭제 버튼이 활성화된다.
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteWorkspace, myWorkspacesQueryKey } from '@/entities/workspace';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/shared/ui/dialog';

interface DeleteWorkspaceDialogProps {
  workspaceId: string;
  workspaceName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteWorkspaceDialog({
  workspaceId,
  workspaceName,
  open,
  onOpenChange,
}: DeleteWorkspaceDialogProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const canDelete = confirmText === workspaceName && !isDeleting;

  const handleDelete = async () => {
    if (!canDelete) return;
    setIsDeleting(true);
    try {
      await deleteWorkspace({ workspaceId });
      // 목록은 client-side react-query 캐시라 별도로 무효화해야 즉시 사라진다.
      await queryClient.invalidateQueries({ queryKey: myWorkspacesQueryKey });
      router.push('/workspaces');
      // 성공 시 페이지 이동으로 언마운트되므로 isDeleting을 리셋하지 않는다(버튼 깜빡임 방지)
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : '워크스페이스 삭제에 실패했어요. 잠시 후 다시 시도해주세요.',
      );
      setIsDeleting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (isDeleting) return;
        setConfirmText('');
        onOpenChange(next);
      }}
    >
      <DialogContent className="p-6 sm:max-w-[380px]">
        <DialogTitle className="font-bold">워크스페이스를 삭제하시겠어요?</DialogTitle>
        <DialogDescription>
          워크스페이스의 모든 데이터(업무, 일정, 공지, 자료 등)가 함께 삭제되며, 되돌릴 수 없어요.
        </DialogDescription>

        <label className="mt-2 block">
          <span className="text-sm font-bold text-slate-900">
            확인을 위해 워크스페이스 이름 <span className="text-red-500">{workspaceName}</span>을
            입력하세요.
          </span>
          <input
            value={confirmText}
            onChange={(event) => setConfirmText(event.target.value)}
            placeholder={workspaceName}
            className="mt-2 h-11 w-full rounded-2xl bg-slate-100 px-4 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-300"
          />
        </label>

        <DialogFooter className="mx-0 mb-0 border-t-0 bg-transparent p-0 pt-2">
          <button
            type="button"
            onClick={() => {
              setConfirmText('');
              onOpenChange(false);
            }}
            disabled={isDeleting}
            className="h-10 rounded-2xl border border-slate-200 px-5 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={!canDelete}
            className="flex h-10 items-center justify-center rounded-2xl bg-red-500 px-5 text-sm font-bold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? <Loader2 size={18} className="animate-spin" /> : '삭제하기'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
