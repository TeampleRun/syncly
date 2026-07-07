// 업무 목데이터
import type { Task } from './task.types';

export const mockTasks: Task[] = [
  { title: '운동 통계 차트', point: 8, status: 'progress' },
  { title: '푸시 알림 설정', point: 3, status: 'progress' },
  { title: '이번 주 배포 준비', point: 5, status: 'progress' },
  { title: '온보딩 플로우 개선', point: 5, status: 'todo' },
  { title: '성능 최적화 (Lighthouse)', point: 5, status: 'todo' },
  { title: '스플래시 화면 개선', point: 2, status: 'done' },
];
