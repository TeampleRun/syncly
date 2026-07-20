// 스프린트 업무 카드 — 카테고리 태그 · 포인트 · 제목 · 담당자를 표시하고,
// 호버 시 수정/삭제 버튼과 드래그 어피던스를 제공하는 상호작용 카드(→ 피처에 위치).
// 색상 토큰(TASK_CATEGORY)은 entities를 단일 출처로 사용한다.
import type { DragEventHandler } from 'react';

import { Pencil, Trash2 } from 'lucide-react';

import { TASK_CATEGORY } from '@/entities/side-project/task';

import { getAvatarColor } from '@/shared/lib/avatar-color';

import type { BoardTask } from '../model/board-task';

interface TaskCardProps {
  task: BoardTask;
  onEdit?: () => void;
  onDelete?: () => void;
  draggable?: boolean;
  onDragStart?: DragEventHandler<HTMLElement>;
  onDragEnd?: DragEventHandler<HTMLElement>;
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  draggable,
  onDragStart,
  onDragEnd,
}: TaskCardProps) {
  const category = task.category ? TASK_CATEGORY[task.category] : null;
  const hasActions = Boolean(onEdit || onDelete);

  return (
    <article
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`border-brand/10 group relative rounded-xl border bg-white p-3 shadow-sm ${
        draggable ? 'cursor-grab active:cursor-grabbing' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        {category ? (
          <span
            className="rounded-md px-2 py-0.5 text-xs font-semibold"
            style={{ backgroundColor: category.bg, color: category.text }}
          >
            {category.label}
          </span>
        ) : (
          <span />
        )}
        <span className="text-brand-muted text-xs">{task.point}pt</span>
      </div>

      <p className="text-brand-ink mt-2 text-sm font-semibold">{task.title}</p>

      {task.assignee && (
        <div className="mt-3 flex items-center gap-2">
          <span
            className="flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: getAvatarColor(task.assigneeId) }}
          >
            {task.assignee.avatarLabel}
          </span>
          <span className="text-brand-muted text-xs">{task.assignee.name}</span>
        </div>
      )}

      {hasActions && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              aria-label="업무 수정"
              className="text-brand-muted hover:text-brand-ink flex size-6 items-center justify-center rounded-md bg-white shadow-sm"
            >
              <Pencil className="size-3.5" aria-hidden="true" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              aria-label="업무 삭제"
              className="flex size-6 items-center justify-center rounded-md bg-white text-red-400 shadow-sm hover:text-red-600"
            >
              <Trash2 className="size-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </article>
  );
}
