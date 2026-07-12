// DB row → Task 엔티티 매퍼 — snake_case→camelCase, null 흡수, 담당자 조인 변환을 한곳에 모은다.
// DB enum(task_status/priority/category)은 엔티티 유니온과 값이 동일해 캐스팅 없이 대입된다.
import type { Task, TaskAssignee } from './task.types';
import type { TaskWithAssigneeRow } from './task.db.types';

/**
 * 조인된 profiles row → 화면용 담당자(TaskAssignee).
 * 미배정(백로그 등)이면 null. avatarLabel은 표시명 첫 글자(성)로, 빈 이름은 '?'로 방어한다.
 */
function toAssignee(profile: { real_name: string } | null): TaskAssignee | null {
  if (!profile) return null;
  const name = profile.real_name.trim();
  return { name, avatarLabel: name.charAt(0) || '?' };
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
    assignee: toAssignee(row.assignee),
  };
}
