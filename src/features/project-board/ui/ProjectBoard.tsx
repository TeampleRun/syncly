'use client';

import type { DragEvent, KeyboardEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { ProjectColumn } from '@/entities/project-column';
import type { ProjectBoardColumn } from '@/entities/project-column';
import { getMockTasksByWorkspaceId } from '@/entities/task';
import type { Task, TaskStatus } from '@/entities/task';
import {
  createProjectBoardColumns,
  flattenProjectBoardColumns,
} from '../model/project-board-columns';

const DEFAULT_ASSIGNEE = {
  name: '김지은',
  initial: '김',
  color: '#1BB6DB',
};

type ProjectBoardProps = {
  workspaceId: string;
};

export function ProjectBoard({ workspaceId }: ProjectBoardProps) {
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [tasks, setTasks] = useState(() => getMockTasksByWorkspaceId(workspaceId));
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [dragOverState, setDragOverState] = useState<{
    columnId: TaskStatus;
    index: number;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const taskCount = tasks.length;
  const columns = createProjectBoardColumns(tasks);

  useEffect(() => {
    if (!isComposerOpen) {
      return;
    }

    inputRef.current?.focus();
  }, [isComposerOpen]);

  const createTask = () => {
    const trimmedTitle = taskTitle.trim();

    if (!trimmedTitle) {
      return;
    }

    const today = new Date();
    const formattedDate = `${today.getMonth() + 1}/${today.getDate()}`;

    const newTask: Task = {
      id: `task-${taskCount + 1}-${Date.now()}`,
      workspaceId,
      title: trimmedTitle,
      assignee: DEFAULT_ASSIGNEE.name,
      assigneeInitial: DEFAULT_ASSIGNEE.initial,
      assigneeColor: DEFAULT_ASSIGNEE.color,
      dueDate: formattedDate,
      status: 'todo',
    };

    setTasks((currentTasks) => [...currentTasks, newTask]);
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
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
  };

  const handleDropTask = (
    targetColumnId: TaskStatus,
    targetIndex: number,
    droppedTaskId?: string,
  ) => {
    const activeTaskId = droppedTaskId ?? draggingTaskId;

    if (!activeTaskId) {
      return;
    }

    let movedTask: Task | null = null;
    let sourceColumnId: TaskStatus | null = null;
    let sourceTaskIndex: number | null = null;

    const nextColumns = columns.map((column) => {
      const taskIndex = column.tasks.findIndex((task) => task.id === activeTaskId);

      if (taskIndex === -1) {
        return column;
      }

      sourceColumnId = column.id;
      sourceTaskIndex = taskIndex;
      movedTask = { ...column.tasks[taskIndex], status: targetColumnId };

      return {
        ...column,
        tasks: column.tasks.filter((task) => task.id !== activeTaskId),
      };
    });

    if (!movedTask) {
      setDraggingTaskId(null);
      setDragOverState(null);
      return;
    }

    const nextTask = movedTask;

    const reorderedColumns = nextColumns.map((column) => {
      if (column.id !== targetColumnId) {
        return column;
      }

      const insertionIndex =
        sourceColumnId === targetColumnId
          ? Math.min(
              sourceTaskIndex !== null && sourceTaskIndex < targetIndex
                ? targetIndex - 1
                : targetIndex,
              column.tasks.length,
            )
          : Math.min(targetIndex, column.tasks.length);

      return {
        ...column,
        tasks: [
          ...column.tasks.slice(0, insertionIndex),
          nextTask,
          ...column.tasks.slice(insertionIndex),
        ],
      };
    });

    setTasks(flattenProjectBoardColumns(reorderedColumns));
    setDraggingTaskId(null);
    setDragOverState(null);
  };

  const handleDragStartTask = (event: DragEvent<HTMLElement>, taskId: string) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', taskId);
    setDraggingTaskId(taskId);
  };

  const handleDragEndTask = () => {
    setDraggingTaskId(null);
    setDragOverState(null);
  };

  return (
    <section className="mx-auto flex max-w-[1284px] flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-brand-ink text-[32px] leading-tight font-extrabold tracking-[-0.04em]">
          프로젝트 관리
        </h2>
        <button
          type="button"
          onClick={() => setIsComposerOpen(true)}
          className="bg-brand hover:bg-brand-deep inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white transition-colors"
        >
          <Plus className="size-4" />새 업무
        </button>
      </div>

      {isComposerOpen ? (
        <div className="border-brand/20 rounded-[24px] border bg-white px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="bg-brand-secondary flex items-center gap-3 rounded-full px-5 py-3">
            <input
              ref={inputRef}
              aria-label="업무 제목 입력"
              className="text-brand-ink placeholder:text-brand-muted min-w-0 flex-1 bg-transparent text-base outline-none"
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
              className="text-brand-muted flex size-10 items-center justify-center rounded-full bg-white"
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
            onDragEndTask={handleDragEndTask}
            draggingTaskId={draggingTaskId}
            dragOverIndex={dragOverState?.columnId === column.id ? dragOverState.index : null}
            onDragOverTask={(columnId, index) => setDragOverState({ columnId, index })}
            onDragLeaveColumn={(columnId) => {
              setDragOverState((current) => (current?.columnId === columnId ? null : current));
            }}
          />
        ))}
      </div>
    </section>
  );
}
