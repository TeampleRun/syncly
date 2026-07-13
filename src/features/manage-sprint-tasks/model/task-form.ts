// 업무 추가/수정 다이얼로그의 폼 값과, 폼 ↔ Task/입력 변환 헬퍼.
// 담당자는 워크스페이스 멤버에서 선택하며, 폼은 선택한 멤버의 id(assigneeId)만 담는다(표시명은 members에서 해석).
import type { Task, TaskCategory, TaskInput, TaskPriority } from '@/entities/side-project/task';

export interface TaskFormValues {
  title: string;
  point: number;
  category: TaskCategory | null;
  priority: TaskPriority;
  /** 담당자 profiles.id. 미배정이면 null */
  assigneeId: string | null;
}

export const EMPTY_TASK_FORM: TaskFormValues = {
  title: '',
  point: 1,
  category: null,
  priority: 'medium',
  assigneeId: null,
};

// 기존 Task를 편집 폼 초기값으로 변환
export function valuesFromTask(task: Task): TaskFormValues {
  return {
    title: task.title,
    point: task.point,
    category: task.category,
    priority: task.priority,
    assigneeId: task.assigneeId,
  };
}

// 폼 값 → 서버액션 입력(TaskInput).
export function toTaskInput(values: TaskFormValues): TaskInput {
  return {
    title: values.title.trim(),
    point: values.point,
    category: values.category,
    priority: values.priority,
    assigneeId: values.assigneeId,
  };
}
