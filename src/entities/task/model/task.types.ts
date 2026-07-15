export type TaskStatus = 'todo' | 'in-progress' | 'done';

interface StatusStyle {
  label: string;
  dot: string;
  bg: string;
  text: string;
}

// 상태 뱃지 스타일 — 대시보드 등 상태 표시가 필요한 곳에서 공용으로 쓴다.
export const TASK_STATUS: Record<TaskStatus, StatusStyle> = {
  todo: { label: '대기', dot: '#d1d5dc', bg: '#f3f4f6', text: '#6a7282' },
  'in-progress': { label: '진행 중', dot: '#2b7fff', bg: '#e0e7ff', text: '#432dd7' },
  done: { label: '완료', dot: '#22c55e', bg: '#dcfce7', text: '#16a34a' },
};

export type Task = {
  id: string;
  workspaceId: string;
  title: string;
  assigneeId: string | null;
  assignee: string;
  assigneeInitial: string;
  assigneeColor: string;
  dueDate: string;
  status: TaskStatus;
  sortOrder: number;
};
