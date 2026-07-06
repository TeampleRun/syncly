// 업무(Task) 도메인 모델 + 상태 스타일 + 목데이터
export type TaskStatus = 'progress' | 'todo';

interface StatusStyle {
  label: string;
  dot: string;
  bg: string;
  text: string;
}

export const TASK_STATUS: Record<TaskStatus, StatusStyle> = {
  progress: { label: '진행 중', dot: '#2b7fff', bg: '#e0e7ff', text: '#432dd7' },
  todo: { label: '대기', dot: '#d1d5dc', bg: '#f3f4f6', text: '#6a7282' },
};

export interface Task {
  title: string;
  point: number;
  status: TaskStatus;
}

export const mockTasks: Task[] = [
  { title: '운동 통계 차트', point: 8, status: 'progress' },
  { title: '푸시 알림 설정', point: 3, status: 'progress' },
  { title: '온보딩 플로우 개선', point: 5, status: 'todo' },
  { title: '성능 최적화 (Lighthouse)', point: 5, status: 'todo' },
];
