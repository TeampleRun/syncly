// 업무(Task) 도메인 모델 + 상태 스타일
export type TaskStatus = 'progress' | 'todo' | 'done';

interface StatusStyle {
  label: string;
  dot: string;
  bg: string;
  text: string;
}

export const TASK_STATUS: Record<TaskStatus, StatusStyle> = {
  progress: { label: '진행 중', dot: '#2b7fff', bg: '#e0e7ff', text: '#432dd7' },
  todo: { label: '대기', dot: '#d1d5dc', bg: '#f3f4f6', text: '#6a7282' },
  done: { label: '완료', dot: '#22c55e', bg: '#dcfce7', text: '#16a34a' },
};

export interface Task {
  id: string;
  title: string;
  point: number;
  status: TaskStatus;
}
