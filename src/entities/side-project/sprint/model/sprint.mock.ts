// 스프린트 목데이터
import type { Stat } from '@/shared/dashboard/ui/stat-card';

import type { Sprint, VelocityPoint } from './sprint.types';

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

/** 스프린트별 계획/완료 포인트 추이 */
export const sprintVelocity: VelocityPoint[] = [
  { sprint: 'S1', planned: 38, completed: 34 },
  { sprint: 'S2', planned: 42, completed: 28 },
];
