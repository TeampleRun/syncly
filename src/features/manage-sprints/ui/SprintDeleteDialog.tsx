'use client';

import { useEffect, useRef } from 'react';

interface SprintDeleteDialogProps {
  sprintName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function SprintDeleteDialog({ sprintName, onClose, onConfirm }: SprintDeleteDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    dialog.showModal();
    const handleCancel = (event: Event) => {
      event.preventDefault();
      onClose();
    };
    dialog.addEventListener('cancel', handleCancel);
    return () => dialog.removeEventListener('cancel', handleCancel);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="sprint-delete-title"
      className="m-auto w-full max-w-[400px] rounded-2xl bg-white p-6 text-slate-950 shadow-2xl [&::backdrop]:bg-slate-950/35"
    >
      <h2 id="sprint-delete-title" className="text-lg font-bold text-slate-950">
        스프린트 삭제
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        <span className="font-semibold text-slate-900">{sprintName}</span> 스프린트를 삭제할까요? 이
        작업은 되돌릴 수 없습니다.
      </p>

      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="h-10 rounded-2xl bg-slate-100 px-4 text-sm font-bold text-slate-700 hover:bg-slate-200"
        >
          취소
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="h-10 rounded-2xl bg-red-500 px-4 text-sm font-bold text-white hover:bg-red-600"
        >
          삭제
        </button>
      </div>
    </dialog>
  );
}
