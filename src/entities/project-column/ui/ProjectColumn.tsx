import type { DragEvent } from 'react';
import { ProjectTaskCard } from '@/entities/project-task';
import { cn } from '@/shared/lib/utils';
import type { ProjectBoardColumn } from '../model/types';

type ProjectColumnProps = {
  column: ProjectBoardColumn;
  onDeleteTask: (taskId: string) => void;
  onDropTask: (columnId: string, taskId?: string) => void;
  onDragStartTask: (event: DragEvent<HTMLElement>, taskId: string) => void;
  onDragEndTask: () => void;
  draggingTaskId: string | null;
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
}: ProjectColumnProps) {
  const handleDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const taskId = event.dataTransfer.getData('text/plain') || undefined;
    onDropTask(column.id, taskId);
  };

  return (
    <section
      className="rounded-[20px] bg-[#f1f3f999] p-5"
      onDragOver={(event) => event.preventDefault()}
      onDragEnter={(event) => event.preventDefault()}
      onDrop={handleDrop}
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
        onDragOver={(event) => event.preventDefault()}
        onDragEnter={(event) => event.preventDefault()}
        onDrop={handleDrop}
      >
        {column.tasks.map((task) => (
          <ProjectTaskCard
            key={task.id}
            task={task}
            onDelete={onDeleteTask}
            onDragStart={onDragStartTask}
            onDragEnd={onDragEndTask}
            isDragging={draggingTaskId === task.id}
          />
        ))}
      </div>
    </section>
  );
}
