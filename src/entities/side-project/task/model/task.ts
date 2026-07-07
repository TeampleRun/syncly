// 업무(Task) 도메인 모델 + 상태 스타일 + 목데이터
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
  title: string;
  point: number;
  status: TaskStatus;
}

export const mockTasks: Task[] = [
  { title: '운동 통계 차트', point: 8, status: 'progress' },
  { title: '푸시 알림 설정', point: 3, status: 'progress' },
  { title: '이번 주 배포 준비', point: 5, status: 'progress' },
  { title: '온보딩 플로우 개선', point: 5, status: 'todo' },
  { title: '성능 최적화 (Lighthouse)', point: 5, status: 'todo' },
  { title: '스플래시 화면 개선', point: 2, status: 'done' },
];
