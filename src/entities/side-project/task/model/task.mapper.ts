// DB row ↔ Task 엔티티 매퍼 — snake_case↔camelCase, null 흡수, 담당자 조인/역변환을 한곳에 모은다.
// DB enum(task_status/priority/category)은 엔티티 유니온과 값이 동일해 캐스팅 없이 대입된다.
import type { GenericTablesInsert, GenericTablesUpdate } from '@/shared/model/supabase.types';
import type { Task, TaskAssignee } from './task.types';
import type { TaskWithAssigneeRow } from './task.db.types';
import type { TaskInput } from './task.schema';

/**
 * assignee_id + 조인된 profiles row → 화면용 담당자(TaskAssignee).
 * 미배정(assignee_id null 또는 조인 empty)이면 null. avatarLabel은 표시명 첫 글자(성)로, 빈 이름은 '?'로 방어한다.
 */
function toAssignee(
  assigneeId: string | null,
  profile: { real_name: string } | null,
): TaskAssignee | null {
  if (!assigneeId || !profile) return null;
  const name = profile.real_name.trim();
  return { userId: assigneeId, name, avatarLabel: name.charAt(0) || '?' };
}

/**
 * tasks row(담당자 조인 포함) → Task 엔티티.
 * point는 DB에서 null 허용(미산정)이나 엔티티는 숫자를 보장하므로 0으로 흡수한다.
 * sprintId는 null을 유지한다(null → 백로그).
 */
export function toTask(row: TaskWithAssigneeRow): Task {
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    sprintId: row.sprint_id,
    title: row.title,
    point: row.point ?? 0,
    status: row.status,
    priority: row.priority,
    category: row.category,
    assignee: toAssignee(row.assignee_id, row.assignee),
  };
}

/**
 * 검증된 입력 → tasks insert 페이로드. id/status는 DB/기본값에 맡기지 않고 명시한다.
 * assignee.userId는 이미 폼→입력 단계에서 assigneeId로 추출돼 그대로 assignee_id에 매핑된다.
 */
export function toTaskInsert(
  input: TaskInput,
  ctx: { workspaceId: string; sprintId: string | null; createdBy: string },
): GenericTablesInsert<'tasks'> {
  return {
    workspace_id: ctx.workspaceId,
    sprint_id: ctx.sprintId,
    created_by: ctx.createdBy,
    assignee_id: input.assigneeId,
    title: input.title,
    point: input.point,
    category: input.category,
    priority: input.priority,
    status: 'todo',
  };
}

/** 검증된 입력 → tasks update 페이로드(편집 가능 필드만). 배치(workspace/sprint/status)는 여기서 바꾸지 않는다. */
export function toTaskUpdate(input: TaskInput): GenericTablesUpdate<'tasks'> {
  return {
    title: input.title,
    point: input.point,
    category: input.category,
    priority: input.priority,
    assignee_id: input.assigneeId,
  };
}
