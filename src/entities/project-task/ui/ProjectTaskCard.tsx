import type { DragEvent } from 'react';
import { Clock3, X } from 'lucide-react';
import type { ProjectTask } from '../model/types';

type ProjectTaskCardProps = {
  task: ProjectTask;
  onDelete: (taskId: string) => void;
  onDragStart: (event: DragEvent<HTMLElement>, taskId: string) => void;
  onDragEnd: () => void;
  isDragging?: boolean;
};

export function ProjectTaskCard({
  task,
  onDelete,
  onDragStart,
  onDragEnd,
  isDragging = false,
}: ProjectTaskCardProps) {
  return (
    <article
      draggable
      onDragStart={(event) => onDragStart(event, task.id)}
      onDragEnd={onDragEnd}
      className="group rounded-[22px] border border-brand/10 bg-white p-[18px] shadow-[0_1px_2px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)] transition-opacity"
      style={{ opacity: isDragging ? 0.55 : 1 }}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="pr-2 text-[17px] leading-[1.25] font-semibold tracking-[-0.02em] text-brand-ink">
          {task.title}
        </h3>
        <button
          type="button"
          onClick={() => onDelete(task.id)}
          className="rounded-full p-1 text-brand-muted opacity-0 transition hover:bg-brand-soft hover:text-brand-ink group-hover:opacity-100"
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
          <span className="text-[15px] text-brand-muted">{task.assignee}</span>
        </div>

        <div className="flex items-center gap-1.5 text-[15px] text-brand-muted">
          <Clock3 className="size-4" />
          <span>{task.dueDate}</span>
        </div>
      </div>
    </article>
  );
}
