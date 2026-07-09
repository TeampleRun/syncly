'use client';

// 업무 추가/수정 모달 — 네이티브 <dialog>.showModal()을 사용해 포커스 트랩·Escape·백드롭을 브라우저가 제공한다.
// 톤은 자료실(ResourceAddDialog)과 동일(rounded-2xl 패널, 브랜드 퍼플 버튼, 슬레이트 입력, 브랜드 pill 토글).
// 열림/닫힘은 부모의 조건부 마운트로 제어하므로, 마운트 시 초기값으로 seed되어 별도 리셋 로직이 필요 없다.
import { useEffect, useRef, useState, type FormEvent } from 'react';

import { X } from 'lucide-react';

import {
  TASK_CATEGORY,
  TASK_PRIORITY,
  type TaskCategory,
  type TaskPriority,
} from '@/entities/side-project/task';
import type { WorkspaceMember } from '@/entities/workspace-member';
import { cn } from '@/shared/lib/utils';

import { getAvatarColor } from '../lib/avatar-color';
import { EMPTY_TASK_FORM, type TaskFormValues } from '../model/task-form';

const inputClass =
  'h-11 w-full rounded-xl bg-slate-100 px-4 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-300';
const pillClass =
  'flex h-9 items-center gap-1.5 rounded-2xl border border-indigo-100 px-3 text-sm font-bold text-slate-500';
const pillActiveClass = 'border-[var(--color-brand)] text-[var(--color-brand)]';
const fieldLabelClass = 'mb-1.5 text-sm font-bold text-slate-700';

const priorityOptions = Object.entries(TASK_PRIORITY) as [
  TaskPriority,
  { label: string; color: string },
][];
const categoryOptions = Object.entries(TASK_CATEGORY) as [TaskCategory, { label: string }][];

interface TaskFormDialogProps {
  title: string;
  /** 담당자 후보 — 워크스페이스 멤버 */
  members: WorkspaceMember[];
  /** 수정 모드일 때의 초기값. 없으면 빈 폼(추가 모드) */
  initialValues?: TaskFormValues;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => void;
}

export function TaskFormDialog({
  title,
  members,
  initialValues,
  onClose,
  onSubmit,
}: TaskFormDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [values, setValues] = useState<TaskFormValues>(initialValues ?? EMPTY_TASK_FORM);
  const canSubmit = values.title.trim().length > 0;

  // 네이티브 모달로 열기 — showModal()이 포커스 트랩·백드롭·Escape를 제공한다.
  // Escape(cancel 이벤트)는 네이티브 닫힘 대신 부모 언마운트(onClose)로 통일한다.
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
      aria-labelledby="task-form-title"
      className="m-auto max-h-[90vh] w-full max-w-[470px] overflow-y-auto rounded-2xl bg-white p-6 text-slate-950 shadow-2xl [&::backdrop]:bg-slate-950/35"
    >
      <div className="flex items-center justify-between">
        <h2 id="task-form-title" className="text-xl font-bold text-slate-950">
          {title}
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
        <input
          aria-label="업무 제목"
          autoFocus
          value={values.title}
          onChange={(event) => setValues((v) => ({ ...v, title: event.target.value }))}
          placeholder="업무 제목"
          className={inputClass}
        />

        <div>
          <p className={fieldLabelClass}>포인트</p>
          <input
            type="number"
            min={0}
            aria-label="포인트"
            value={values.point}
            onChange={(event) =>
              setValues((v) => ({ ...v, point: Number(event.target.value) || 0 }))
            }
            className={inputClass}
          />
        </div>

        <div>
          <p className={fieldLabelClass}>우선순위</p>
          <div className="flex flex-wrap gap-2">
            {priorityOptions.map(([key, { label, color }]) => (
              <button
                key={key}
                type="button"
                onClick={() => setValues((v) => ({ ...v, priority: key }))}
                className={cn(pillClass, values.priority === key && pillActiveClass)}
              >
                <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className={fieldLabelClass}>카테고리</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setValues((v) => ({ ...v, category: null }))}
              className={cn(pillClass, values.category === null && pillActiveClass)}
            >
              없음
            </button>
            {categoryOptions.map(([key, { label }]) => (
              <button
                key={key}
                type="button"
                onClick={() => setValues((v) => ({ ...v, category: key }))}
                className={cn(pillClass, values.category === key && pillActiveClass)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className={fieldLabelClass}>담당자</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setValues((v) => ({ ...v, assignee: null }))}
              className={cn(pillClass, values.assignee === null && pillActiveClass)}
            >
              미배정
            </button>
            {members.map((member) => {
              const selected = values.assignee?.name === member.workspaceNickname;
              return (
                <button
                  key={member.userId}
                  type="button"
                  onClick={() =>
                    setValues((v) => ({
                      ...v,
                      assignee: {
                        name: member.workspaceNickname,
                        avatarLabel: member.avatarLabel,
                      },
                    }))
                  }
                  className={cn(pillClass, selected && pillActiveClass)}
                >
                  <span
                    className="flex size-5 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                    style={{ backgroundColor: getAvatarColor(member.avatarLabel) }}
                  >
                    {member.avatarLabel}
                  </span>
                  {member.workspaceNickname}
                </button>
              );
            })}
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
