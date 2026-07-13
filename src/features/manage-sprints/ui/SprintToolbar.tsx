'use client';

// 스프린트 액션 버튼(생성/수정/삭제) + 다이얼로그 열림 상태 — UI 전용.
// 저장/삭제 로직은 아직 미배선(TODO). 현재 스프린트를 대상으로 수정/삭제한다.
import { useState } from 'react';

import { Pencil, Plus, Trash2 } from 'lucide-react';

import type { Sprint } from '@/entities/side-project/sprint';

import { SprintDeleteDialog } from './SprintDeleteDialog';
import { SprintFormDialog } from './SprintFormDialog';

type DialogState = { mode: 'create' } | { mode: 'edit' } | { mode: 'delete' } | null;

const iconButtonClass =
  'border-brand/10 text-brand-muted hover:text-brand-ink flex size-9 items-center justify-center rounded-full border bg-white transition-colors';

export function SprintToolbar({ sprint }: { sprint: Sprint }) {
  const [dialog, setDialog] = useState<DialogState>(null);

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setDialog({ mode: 'create' })}
        className="bg-brand hover:bg-brand-deep inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white transition-colors"
      >
        <Plus className="size-4" aria-hidden />새 스프린트
      </button>
      <button
        type="button"
        aria-label="스프린트 수정"
        onClick={() => setDialog({ mode: 'edit' })}
        className={iconButtonClass}
      >
        <Pencil className="size-4" aria-hidden />
      </button>
      <button
        type="button"
        aria-label="스프린트 삭제"
        onClick={() => setDialog({ mode: 'delete' })}
        className={`${iconButtonClass} hover:text-red-500`}
      >
        <Trash2 className="size-4" aria-hidden />
      </button>

      {(dialog?.mode === 'create' || dialog?.mode === 'edit') && (
        <SprintFormDialog
          mode={dialog.mode}
          initial={dialog.mode === 'edit' ? sprint : undefined}
          onClose={() => setDialog(null)}
          // TODO(후속): 스프린트 생성/수정 서버액션(useMutation) 연결
          onSubmit={() => setDialog(null)}
        />
      )}
      {dialog?.mode === 'delete' && (
        <SprintDeleteDialog
          sprintName={sprint.name}
          onClose={() => setDialog(null)}
          // TODO(후속): 스프린트 삭제 서버액션(useMutation) 연결
          onConfirm={() => setDialog(null)}
        />
      )}
    </div>
  );
}
