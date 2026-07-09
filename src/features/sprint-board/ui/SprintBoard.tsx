'use client';

// 스프린트 보드 — 칸반(대기/진행 중/완료) + 백로그를 담는 상호작용 컨테이너.
// 상태·CRUD·드래그는 useSprintBoard 훅에 위임하고, 여기서는 다이얼로그 열림 상태만 관리한다.
import { useState } from 'react';

import { Plus } from 'lucide-react';

import type { Task } from '@/entities/side-project/task';
import type { WorkspaceMember } from '@/entities/workspace-member';

import { useSprintBoard } from '../model/use-sprint-board';
import { valuesFromTask, type TaskFormValues } from '../model/task-form';
import { BacklogSection } from './BacklogSection';
import { SprintColumn } from './SprintColumn';
import { TaskFormDialog } from './TaskFormDialog';

// 다이얼로그 상태 — 스프린트 추가 / 백로그 추가 / 수정(대상 Task) / 닫힘
type DialogState =
  { mode: 'add-sprint' } | { mode: 'add-backlog' } | { mode: 'edit'; task: Task } | null;

interface SprintBoardProps {
  sprintId: string;
  workspaceId: string;
  initialTasks: Task[];
  initialBacklog: Task[];
  members: WorkspaceMember[];
}

export function SprintBoard({
  sprintId,
  workspaceId,
  initialTasks,
  initialBacklog,
  members,
}: SprintBoardProps) {
  const {
    columns,
    backlogTasks,
    addSprintTask,
    addBacklogTask,
    updateTask,
    deleteTask,
    dragProps,
    dropProps,
    dragOverStatus,
  } = useSprintBoard({ sprintId, workspaceId, initialTasks, initialBacklog });

  const [dialog, setDialog] = useState<DialogState>(null);

  const handleSubmit = (values: TaskFormValues) => {
    if (!dialog) return;
    if (dialog.mode === 'add-sprint') addSprintTask(values);
    else if (dialog.mode === 'add-backlog') addBacklogTask(values);
    else updateTask(dialog.task.id, values);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setDialog({ mode: 'add-sprint' })}
          className="bg-brand hover:bg-brand-deep inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-colors"
        >
          <Plus className="size-4" />새 업무
        </button>
      </div>

      {/* 칸반 보드 — 상태별 컬럼 */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {columns.map((column) => (
          <SprintColumn
            key={column.id}
            column={column}
            isDragOver={dragOverStatus === column.id}
            dropProps={dropProps(column.id)}
            getDragProps={dragProps}
            onEditTask={(task) => setDialog({ mode: 'edit', task })}
            onDeleteTask={deleteTask}
          />
        ))}
      </section>

      {/* 백로그 섹션 */}
      <BacklogSection
        tasks={backlogTasks}
        onAdd={() => setDialog({ mode: 'add-backlog' })}
        onEdit={(task) => setDialog({ mode: 'edit', task })}
        onDelete={deleteTask}
      />

      {dialog && (
        <TaskFormDialog
          title={dialog.mode === 'edit' ? '업무 수정' : '새 업무'}
          members={members}
          initialValues={dialog.mode === 'edit' ? valuesFromTask(dialog.task) : undefined}
          onClose={() => setDialog(null)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
