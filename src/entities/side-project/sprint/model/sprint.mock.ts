// 스프린트 목데이터 — 현재 스프린트 메타 + 벨로시티
// 업무(Task)는 여기서 소유하지 않는다 → task.mock.ts / task.selectors.ts 참고
import type { Sprint, VelocityPoint } from './sprint.types';

// 사이드 프로젝트 데모 워크스페이스 id — 스프린트·업무 목데이터가 공유하는 소유 워크스페이스
export const SIDE_PROJECT_WORKSPACE_ID = 'ws-side-project';

export const currentSprint: Sprint = {
  id: 'sprint-2',
  workspaceId: SIDE_PROJECT_WORKSPACE_ID,
  name: 'Sprint 2',
  startDate: '2025-07-01',
  endDate: '2025-07-14',
  daysLeft: 8,
  totalPoints: 42,
  completedPoints: 28,
};

/** 스프린트별 계획/완료 포인트 추이 */
export const sprintVelocity: VelocityPoint[] = [
  { sprint: 'S1', planned: 38, completed: 34 },
  { sprint: 'S2', planned: 42, completed: 28 },
];
