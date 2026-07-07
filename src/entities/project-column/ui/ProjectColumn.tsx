import type { DragEvent } from 'react';
import { TaskCard } from '@/entities/task';
import type { TaskStatus } from '@/entities/task';
import { cn } from '@/shared/lib/utils';
import type { ProjectBoardColumn } from '../model/types';

type ProjectColumnProps = {
  column: ProjectBoardColumn;
  onDeleteTask: (taskId: string) => void;
  onDropTask: (columnId: TaskStatus, targetIndex: number, taskId?: string) => void;
  onDragStartTask: (event: DragEvent<HTMLElement>, taskId: string) => void;
  onDragEndTask: () => void;
  draggingTaskId: string | null;
  dragOverIndex: number | null;
  onDragOverTask: (columnId: TaskStatus, targetIndex: number) => void;
  onDragLeaveColumn: (columnId: TaskStatus) => void;
};

const toneStyles = {
  slate: 'bg-[#f1f3f999] text-[#9aa3b2]',
  brand: 'bg-[#f1f3f999] text-brand-start',
  green: 'bg-[#f1f3f999] text-[#00c950]',
} as const;

export function ProjectColumn({
  column,
  onDeleteTask,
  onDropTask,
  onDragStartTask,
  onDragEndTask,
  draggingTaskId,
  dragOverIndex,
  onDragOverTask,
  onDragLeaveColumn,
}: ProjectColumnProps) {
  const handleDrop = (event: DragEvent<HTMLElement>, targetIndex: number) => {
    event.preventDefault();
    event.stopPropagation();
    const taskId = event.dataTransfer.getData('text/plain') || undefined;
    onDropTask(column.id, targetIndex, taskId);
  };

  return (
    <section
      className="rounded-[20px] bg-[#f1f3f999] p-5"
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          onDragLeaveColumn(column.id);
        }
      }}
    >
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className={cn('size-2.5 rounded-full', toneStyles[column.tone])} />
          <h3 className="text-[17px] font-bold text-brand-ink">{column.title}</h3>
        </div>
        <span className="text-[15px] font-semibold text-brand-muted">{column.tasks.length}</span>
      </header>

      <div
        className="mt-4 min-h-[220px] space-y-3.5 rounded-[16px]"
        onDragOver={(event) => {
          event.preventDefault();
          onDragOverTask(column.id, column.tasks.length);
        }}
        onDrop={(event) => handleDrop(event, column.tasks.length)}
      >
        {column.tasks.map((task, index) => (
          <div
            key={task.id}
            className={cn(
              'rounded-[18px] transition-all',
              dragOverIndex === index && 'relative before:absolute before:-top-2 before:left-0 before:h-1 before:w-full before:rounded-full before:bg-brand',
            )}
            onDragOver={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onDragOverTask(column.id, index);
            }}
            onDrop={(event) => handleDrop(event, index)}
          >
            <TaskCard
              task={task}
              onDelete={onDeleteTask}
              onDragStart={onDragStartTask}
              onDragEnd={onDragEndTask}
              isDragging={draggingTaskId === task.id}
            />
          </div>
        ))}

        {dragOverIndex === column.tasks.length ? (
          <div className="h-1 w-full rounded-full bg-brand" />
        ) : null}
      </div>
    </section>
  );
}
