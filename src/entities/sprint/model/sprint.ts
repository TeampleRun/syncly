// 스프린트 도메인 모델 + 목데이터
import type { Stat } from '@/shared/ui/stat-card';

export interface Sprint {
  name: string;
  period: string;
  daysLeft: number;
}

export const currentSprint: Sprint = {
  name: 'Sprint 2',
  period: '7/1 – 7/14',
  daysLeft: 8,
};

/** 현재 스프린트의 포인트 통계(계획/완료/남은) */
export const sprintStats: Stat[] = [
  { id: 'planned', label: '계획 포인트', value: 42, unit: 'pt', color: '#155dfc' },
  { id: 'done', label: '완료 포인트', value: 28, unit: 'pt', color: '#00a63e' },
  { id: 'remaining', label: '남은 포인트', value: 14, unit: 'pt', color: '#e17100' },
];

export interface VelocityPoint {
  sprint: string;
  planned: number;
  completed: number;
}

/** 벨로시티 차트 Y축 최댓값 */
export const VELOCITY_MAX = 60;

/** 스프린트별 계획/완료 포인트 추이 */
export const sprintVelocity: VelocityPoint[] = [
  { sprint: 'S1', planned: 38, completed: 34 },
  { sprint: 'S2', planned: 42, completed: 28 },
];
