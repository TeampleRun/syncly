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
  slate: 'bg-brand-panel-soft text-[#9aa3b2]',
  brand: 'bg-brand-panel-soft text-brand-start',
  green: 'bg-brand-panel-soft text-[#00c950]',
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
      className="bg-brand-panel-soft rounded-[20px] p-5"
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          onDragLeaveColumn(column.id);
        }
      }}
    >
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className={cn('size-2.5 rounded-full', toneStyles[column.tone])} />
          <h3 className="text-brand-ink text-[17px] font-bold">{column.title}</h3>
        </div>
        <span className="text-brand-muted text-[15px] font-semibold">{column.tasks.length}</span>
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
              dragOverIndex === index &&
                'before:bg-brand relative before:absolute before:-top-2 before:left-0 before:h-1 before:w-full before:rounded-full',
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

        <div
          className={cn(
            'mt-1 rounded-[16px] px-3 transition-all',
            column.tasks.length === 0 ? 'min-h-[96px]' : 'min-h-[72px]',
            dragOverIndex === column.tasks.length
              ? 'bg-brand/6'
              : 'bg-transparent',
          )}
          onDragOver={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onDragOverTask(column.id, column.tasks.length);
          }}
          onDrop={(event) => handleDrop(event, column.tasks.length)}
        >
          {dragOverIndex === column.tasks.length ? (
            <div className="bg-brand mt-2 h-1 w-full rounded-full" />
          ) : null}
        </div>
      </div>
    </section>
  );
}
