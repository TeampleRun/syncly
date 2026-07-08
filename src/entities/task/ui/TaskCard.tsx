import type { DragEvent } from 'react';
import { Clock3, X } from 'lucide-react';
import type { Task } from '../model/task.types';

type TaskCardProps = {
  task: Task;
  onDelete: (taskId: string) => void;
  onDragStart: (event: DragEvent<HTMLElement>, taskId: string) => void;
  onDragEnd: () => void;
  isDragging?: boolean;
};

export function TaskCard({
  task,
  onDelete,
  onDragStart,
  onDragEnd,
  isDragging = false,
}: TaskCardProps) {
  return (
    <article
      draggable
      onDragStart={(event) => onDragStart(event, task.id)}
      onDragEnd={onDragEnd}
      className="group border-brand/10 rounded-[22px] border bg-white p-4.5 shadow-[0_1px_2px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)] transition-opacity"
      style={{ opacity: isDragging ? 0.55 : 1 }}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-brand-ink pr-2 text-[17px] leading-tight font-semibold tracking-[-0.02em]">
          {task.title}
        </h3>
        <button
          type="button"
          onClick={() => onDelete(task.id)}
          className="text-brand-muted hover:bg-brand-soft hover:text-brand-ink rounded-full p-1 opacity-0 transition group-hover:opacity-100"
          aria-label={`${task.title} 삭제`}
        >
          <X className="size-4" />
        </button>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div
            className="flex size-9 items-center justify-center rounded-full text-[15px] font-semibold text-white"
            style={{ backgroundColor: task.assigneeColor }}
          >
            {task.assigneeInitial}
          </div>
          <span className="text-brand-muted text-[15px]">{task.assignee}</span>
        </div>

        <div className="text-brand-muted flex items-center gap-1.5 text-[15px]">
          <Clock3 className="size-4" />
          <span>{task.dueDate}</span>
        </div>
      </div>
    </article>
  );
}
