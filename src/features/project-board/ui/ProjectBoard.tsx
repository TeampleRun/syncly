'use client';

import type { DragEvent, KeyboardEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { ProjectColumn } from '@/entities/project-column';
import type { ProjectBoardColumn } from '@/entities/project-column';
import type { ProjectTask } from '@/entities/project-task';
import { initialProjectBoard } from '../model/mockProjectBoard';

const DEFAULT_ASSIGNEE = {
  name: '김지은',
  initial: '김',
  color: '#1BB6DB',
};

export function ProjectBoard() {
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [columns, setColumns] = useState(initialProjectBoard);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isComposerOpen) {
      return;
    }

    inputRef.current?.focus();
  }, [isComposerOpen]);

  const taskCount = useMemo(
    () => columns.reduce((count, column) => count + column.tasks.length, 0),
    [columns],
  );

  const createTask = () => {
    const trimmedTitle = taskTitle.trim();

    if (!trimmedTitle) {
      return;
    }

    const today = new Date();
    const formattedDate = `${today.getMonth() + 1}/${today.getDate()}`;

    const newTask: ProjectTask = {
      id: `task-${taskCount + 1}-${Date.now()}`,
      title: trimmedTitle,
      assignee: DEFAULT_ASSIGNEE.name,
      assigneeInitial: DEFAULT_ASSIGNEE.initial,
      assigneeColor: DEFAULT_ASSIGNEE.color,
      dueDate: formattedDate,
      columnId: 'todo',
    };

    setColumns((currentColumns) =>
      currentColumns.map((column) =>
        column.id === 'todo'
          ? { ...column, tasks: [...column.tasks, newTask] }
          : column,
      ),
    );
    setTaskTitle('');
    setIsComposerOpen(false);
  };

  const handleComposerKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    createTask();
  };

  const handleDeleteTask = (taskId: string) => {
    setColumns((currentColumns) =>
      currentColumns.map((column) => ({
        ...column,
        tasks: column.tasks.filter((task) => task.id !== taskId),
      })),
    );
  };

  const handleDropTask = (targetColumnId: string, droppedTaskId?: string) => {
    const activeTaskId = droppedTaskId ?? draggingTaskId;

    if (!activeTaskId) {
      return;
    }

    let movedTask: ProjectTask | null = null;

    const nextColumns = columns.map((column) => {
      const remainingTasks = column.tasks.filter((task) => {
        const isDraggingTask = task.id === activeTaskId;

        if (isDraggingTask) {
          movedTask = { ...task, columnId: targetColumnId };
        }

        return !isDraggingTask;
      });

      return { ...column, tasks: remainingTasks };
    });

    if (!movedTask) {
      setDraggingTaskId(null);
      return;
    }

    setColumns(
      nextColumns.map((column) =>
        column.id === targetColumnId
          ? { ...column, tasks: [...column.tasks, movedTask] }
          : column,
      ),
    );
    setDraggingTaskId(null);
  };

  const handleDragStartTask = (event: DragEvent<HTMLElement>, taskId: string) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', taskId);
    setDraggingTaskId(taskId);
  };

  return (
    <section className="mx-auto flex max-w-[1284px] flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[32px] leading-tight font-extrabold tracking-[-0.04em] text-brand-ink">
          프로젝트 관리
        </h2>
        <button
          type="button"
          onClick={() => setIsComposerOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-deep"
        >
          <Plus className="size-4" />
          새 업무
        </button>
      </div>

      {isComposerOpen ? (
        <div className="rounded-[24px] border border-brand/20 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 rounded-full bg-brand-secondary px-5 py-3">
            <input
              ref={inputRef}
              aria-label="업무 제목 입력"
              className="min-w-0 flex-1 bg-transparent text-base text-brand-ink outline-none placeholder:text-brand-muted"
              placeholder="업무 제목 입력 후 Enter"
              value={taskTitle}
              onChange={(event) => setTaskTitle(event.target.value)}
              onKeyDown={handleComposerKeyDown}
            />
            <button
              type="button"
              onClick={() => {
                setTaskTitle('');
                setIsComposerOpen(false);
              }}
              className="flex size-10 items-center justify-center rounded-full bg-white text-brand-muted"
              aria-label="입력 닫기"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-3">
        {columns.map((column: ProjectBoardColumn) => (
          <ProjectColumn
            key={column.id}
            column={column}
            onDeleteTask={handleDeleteTask}
            onDropTask={handleDropTask}
            onDragStartTask={handleDragStartTask}
            onDragEndTask={() => setDraggingTaskId(null)}
            draggingTaskId={draggingTaskId}
          />
        ))}
      </div>
    </section>
  );
}
