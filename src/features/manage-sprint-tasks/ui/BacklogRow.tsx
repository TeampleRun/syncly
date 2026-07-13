// 백로그 행 — 우선순위 점 · 제목 · 포인트 · 우선순위 배지 + (호버 시) 수정/삭제 액션.
// 우선순위 색(TASK_PRIORITY)은 entities를 단일 출처로 사용한다.
// '낮음'은 지정색(#d1d5dc)이 옅어 배지 텍스트로 쓰면 대비가 부족하므로 뮤트 그레이로 대체한다.
import { ArrowRightToLine, Pencil, Trash2 } from 'lucide-react';

import { type Task, TASK_PRIORITY } from '@/entities/side-project/task';

interface BacklogRowProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  /** 현재 스프린트로 편입 */
  onMoveToSprint: () => void;
}

export function BacklogRow({ task, onEdit, onDelete, onMoveToSprint }: BacklogRowProps) {
  const priority = TASK_PRIORITY[task.priority];
  const isLow = task.priority === 'low';

  return (
    <div className="group flex items-center gap-3 py-2.5">
      <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: priority.color }} />
      <span className="text-brand-ink min-w-0 flex-1 truncate text-sm font-medium">
        {task.title}
      </span>
      <span className="text-brand-muted text-xs">{task.point}pt</span>
      <span
        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${isLow ? 'text-brand-muted' : ''}`}
        style={{
          backgroundColor: `${priority.color}26`,
          ...(isLow ? {} : { color: priority.color }),
        }}
      >
        {priority.label}
      </span>

      <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={onMoveToSprint}
          aria-label="현재 스프린트로 이동"
          title="현재 스프린트로 이동"
          className="text-brand-muted hover:text-brand flex size-6 items-center justify-center rounded-md"
        >
          <ArrowRightToLine className="size-3.5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onEdit}
          aria-label="백로그 항목 수정"
          className="text-brand-muted hover:text-brand-ink flex size-6 items-center justify-center rounded-md"
        >
          <Pencil className="size-3.5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label="백로그 항목 삭제"
          className="flex size-6 items-center justify-center rounded-md text-red-400 hover:text-red-600"
        >
          <Trash2 className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
