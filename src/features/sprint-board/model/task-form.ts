// 업무 추가/수정 다이얼로그의 폼 값과, 폼 ↔ Task/입력 변환 헬퍼.
// 담당자는 워크스페이스 멤버에서 선택하며, 선택 결과를 Task.assignee 형태({userId, name, avatarLabel})로 담는다.
import type {
  Task,
  TaskCategory,
  TaskInput,
  TaskPriority,
  TaskAssignee,
} from '@/entities/side-project/task';

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

// 폼 값 → 서버액션 입력(TaskInput). 담당자는 userId만 추출해 assigneeId로 넘긴다(표시용 name/label 제거).
export function toTaskInput(values: TaskFormValues): TaskInput {
  return {
    title: values.title.trim(),
    point: values.point,
    category: values.category,
    priority: values.priority,
    assigneeId: values.assignee?.userId ?? null,
  };
}
