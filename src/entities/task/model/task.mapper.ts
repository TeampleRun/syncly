import type { GenericTablesInsert, GenericTablesUpdate } from '@/shared/model/supabase.types';

import type { TaskRow, TaskStatusDb } from './task.db.types';
import type { Task, TaskStatus } from './task.types';

const AVATAR_PALETTE = [
  '#00C950',
  '#FE9A00',
  '#615FFF',
  '#00B8DB',
  '#2B7FFF',
  '#F6339A',
  '#7E22CE',
] as const;

export interface TaskQueryRow extends Pick<
  TaskRow,
  'id' | 'workspace_id' | 'title' | 'assignee_id' | 'due_date' | 'status' | 'sort_order'
> {
  assignee_profile: {
    real_name: string;
  } | null;
}

export function toUiTaskStatus(status: TaskStatusDb): TaskStatus {
  if (status === 'in_progress') {
    return 'in-progress';
  }

  return status;
}

export function toDbTaskStatus(status: TaskStatus): TaskStatusDb {
  if (status === 'in-progress') {
    return 'in_progress';
  }

  return status;
}

function formatDueDate(isoDate: string | null) {
  if (!isoDate) {
    return '미정';
  }

  const [year, month, day] = isoDate.split('-');

  if (!year || !month || !day) {
    return '미정';
  }

  return `${Number(month)}/${Number(day)}`;
}

function getAvatarColor(seed: string) {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

export function toTask(row: TaskQueryRow): Task {
  const assigneeName = row.assignee_profile?.real_name ?? '미배정';

  return {
    id: row.id,
    workspaceId: row.workspace_id,
    title: row.title,
    assigneeId: row.assignee_id,
    assignee: assigneeName,
    assigneeInitial: assigneeName.slice(0, 1),
    assigneeColor: getAvatarColor(assigneeName),
    dueDate: formatDueDate(row.due_date),
    status: toUiTaskStatus(row.status),
    sortOrder: row.sort_order,
  };
}

export function toTaskInsert(params: {
  workspaceId: string;
  title: string;
  assigneeId: string;
  createdBy: string;
  dueDate: string;
  sortOrder: number;
}): GenericTablesInsert<'tasks'> {
  return {
    workspace_id: params.workspaceId,
    title: params.title,
    assignee_id: params.assigneeId,
    created_by: params.createdBy,
    due_date: params.dueDate,
    sort_order: params.sortOrder,
    status: 'todo',
    priority: 'medium',
    sprint_id: null,
  };
}

export function toTaskBoardUpdate(
  task: Pick<Task, 'status' | 'sortOrder'>,
): GenericTablesUpdate<'tasks'> {
  return {
    status: toDbTaskStatus(task.status),
    sort_order: task.sortOrder,
  };
}
