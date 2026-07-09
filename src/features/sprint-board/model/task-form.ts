// 업무 추가/수정 다이얼로그의 폼 값과, 폼 ↔ Task 변환 헬퍼.
// 담당자는 워크스페이스 멤버에서 선택하며, 선택 결과를 Task.assignee 형태({name, avatarLabel})로 그대로 담는다.
import type { Task, TaskAssignee, TaskCategory, TaskPriority } from '@/entities/side-project/task';

export interface TaskFormValues {
  title: string;
  point: number;
  category: TaskCategory | null;
  priority: TaskPriority;
  assignee: TaskAssignee | null;
}

export const EMPTY_TASK_FORM: TaskFormValues = {
  title: '',
  point: 1,
  category: null,
  priority: 'medium',
  assignee: null,
};

// 기존 Task를 편집 폼 초기값으로 변환
export function valuesFromTask(task: Task): TaskFormValues {
  return {
    title: task.title,
    point: task.point,
    category: task.category,
    priority: task.priority,
    assignee: task.assignee,
  };
}

// 폼 값을 기존 Task에 반영(id/workspaceId/sprintId/status는 유지)
export function applyValuesToTask(task: Task, values: TaskFormValues): Task {
  return {
    ...task,
    title: values.title.trim(),
    point: values.point,
    category: values.category,
    priority: values.priority,
    assignee: values.assignee,
  };
}

// 폼 값으로 새 Task 생성. 배치(스프린트 편입/백로그, 상태)는 호출부가 결정한다.
export function createTaskFromValues(
  values: TaskFormValues,
  placement: { workspaceId: string; sprintId: string | null; status: Task['status'] },
): Task {
  return {
    id: crypto.randomUUID(),
    workspaceId: placement.workspaceId,
    sprintId: placement.sprintId,
    title: values.title.trim(),
    point: values.point,
    status: placement.status,
    priority: values.priority,
    category: values.category,
    assignee: values.assignee,
  };
}
