'use client';

// 톤은 TaskFormDialog와 동일(네이티브 <dialog>.showModal, rounded-2xl 패널, 슬레이트 입력).
import { useEffect, useRef, useState, type FormEvent } from 'react';

import { X } from 'lucide-react';

import type { Sprint } from '@/entities/side-project/sprint';

const inputClass =
  'h-11 w-full rounded-xl bg-slate-100 px-4 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-300';
const fieldLabelClass = 'mb-1.5 text-sm font-bold text-slate-700';

export interface SprintFormValues {
  name: string;
  startDate: string;
  endDate: string;
}

const EMPTY_SPRINT_FORM: SprintFormValues = { name: '', startDate: '', endDate: '' };

interface SprintFormDialogProps {
  mode: 'create' | 'edit';
  /** 수정 모드 초기값 */
  initial?: Sprint;
  onClose: () => void;
  onSubmit: (values: SprintFormValues) => void;
}

export function SprintFormDialog({ mode, initial, onClose, onSubmit }: SprintFormDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [values, setValues] = useState<SprintFormValues>(
    initial
      ? { name: initial.name, startDate: initial.startDate, endDate: initial.endDate }
      : EMPTY_SPRINT_FORM,
  );

  // 이름 + 양쪽 날짜 + 종료일 ≥ 시작일 (서버에서도 재검증)
  const canSubmit =
    values.name.trim().length > 0 &&
    values.startDate !== '' &&
    values.endDate !== '' &&
    values.startDate <= values.endDate;

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

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    onSubmit(values);
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="sprint-form-title"
      className="m-auto w-full max-w-[440px] rounded-2xl bg-white p-6 text-slate-950 shadow-2xl [&::backdrop]:bg-slate-950/35"
    >
      <div className="flex items-center justify-between">
        <h2 id="sprint-form-title" className="text-xl font-bold text-slate-950">
          {mode === 'edit' ? '스프린트 수정' : '새 스프린트'}
        </h2>
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <p className={fieldLabelClass}>스프린트 이름</p>
          <input
            autoFocus
            aria-label="스프린트 이름"
            value={values.name}
            onChange={(event) => setValues((v) => ({ ...v, name: event.target.value }))}
            placeholder="예: Sprint 3"
            className={inputClass}
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <p className={fieldLabelClass}>시작일</p>
            <input
              type="date"
              aria-label="시작일"
              value={values.startDate}
              onChange={(event) => setValues((v) => ({ ...v, startDate: event.target.value }))}
              className={inputClass}
            />
          </div>
          <div className="flex-1">
            <p className={fieldLabelClass}>종료일</p>
            <input
              type="date"
              aria-label="종료일"
              value={values.endDate}
              min={values.startDate || undefined}
              onChange={(event) => setValues((v) => ({ ...v, endDate: event.target.value }))}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-2xl bg-slate-100 px-4 text-sm font-bold text-slate-700 hover:bg-slate-200"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="h-10 rounded-2xl bg-[var(--color-brand)] px-4 text-sm font-bold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            저장
          </button>
        </div>
      </form>
    </dialog>
  );
}
