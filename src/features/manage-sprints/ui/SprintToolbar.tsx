'use client';

// 스프린트 액션 버튼(생성/수정/삭제) + 다이얼로그 열림 상태.
// 생성/수정/삭제는 서버액션 뮤테이션에 연결하고, 실패는 각 훅 onError(toast)에서 노출한다.
// 수정/삭제는 현재 스프린트를 대상으로 한다.
import { useState } from 'react';

import { Pencil, Plus, Trash2 } from 'lucide-react';

import {
  type Sprint,
  useCreateSprint,
  useDeleteSprint,
  useUpdateSprint,
} from '@/entities/side-project/sprint';

import { SprintDeleteDialog } from './SprintDeleteDialog';
import { SprintFormDialog, type SprintFormValues } from './SprintFormDialog';

type DialogState = { mode: 'create' } | { mode: 'edit' } | { mode: 'delete' } | null;

const iconButtonClass =
  'border-brand/10 text-brand-muted hover:text-brand-ink flex size-9 items-center justify-center rounded-full border bg-white transition-colors';

interface SprintToolbarProps {
  workspaceId: string;
  /** 현재 스프린트. 없으면(첫 생성 전) 생성 버튼만 노출한다 */
  sprint?: Sprint;
}

export function SprintToolbar({ workspaceId, sprint }: SprintToolbarProps) {
  const [dialog, setDialog] = useState<DialogState>(null);

  const createSprint = useCreateSprint(workspaceId);
  const updateSprint = useUpdateSprint();
  const deleteSprint = useDeleteSprint();

  // 폼 값(name/startDate/endDate)은 SprintInput과 형태가 같아 그대로 넘긴다(서버에서 재검증)
  const handleSubmit = (values: SprintFormValues) => {
    if (dialog?.mode === 'edit' && sprint) {
      updateSprint.mutate({ id: sprint.id, input: values });
    } else {
      createSprint.mutate({ input: values });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setDialog({ mode: 'create' })}
        className="bg-brand hover:bg-brand-deep inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white transition-colors"
      >
        <Plus className="size-4" aria-hidden />새 스프린트
      </button>

      {/* 수정/삭제는 대상 스프린트가 있을 때만 */}
      {sprint && (
        <>
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
        </>
      )}

      {(dialog?.mode === 'create' || dialog?.mode === 'edit') && (
        <SprintFormDialog
          mode={dialog.mode}
          initial={dialog.mode === 'edit' ? sprint : undefined}
          onClose={() => setDialog(null)}
          onSubmit={handleSubmit}
        />
      )}
      {dialog?.mode === 'delete' && sprint && (
        <SprintDeleteDialog
          sprintName={sprint.name}
          onClose={() => setDialog(null)}
          onConfirm={() => deleteSprint.mutate(sprint.id)}
        />
      )}
    </div>
  );
}
