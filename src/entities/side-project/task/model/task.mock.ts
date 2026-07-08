// 업무 목데이터
import type { Task } from './task.types';

export const mockTasks: Task[] = [
  { id: 'task-1', title: '운동 통계 차트', point: 8, status: 'progress' },
  { id: 'task-2', title: '푸시 알림 설정', point: 3, status: 'progress' },
  { id: 'task-3', title: '이번 주 배포 준비', point: 5, status: 'progress' },
  { id: 'task-4', title: '온보딩 플로우 개선', point: 5, status: 'todo' },
  { id: 'task-5', title: '성능 최적화 (Lighthouse)', point: 5, status: 'todo' },
  { id: 'task-6', title: '스플래시 화면 개선', point: 2, status: 'done' },
];
