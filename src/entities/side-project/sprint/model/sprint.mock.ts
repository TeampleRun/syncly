// 스프린트 목데이터 — 워크스페이스의 스프린트 목록.
// 벨로시티는 이 목록에서 파생한다(selectVelocity) → 중복 상수를 두지 않는다.
// 업무(Task)는 여기서 소유하지 않는다 → task.mock.ts 참고. 백로그는 스프린트와 무관하게 워크스페이스 공통.
import type { Sprint } from './sprint.types';

// 사이드 프로젝트 데모 워크스페이스 id — 실제 워크스페이스(mock-workspace)의 'side-workspace'와 일치시킨다.
export const SIDE_PROJECT_WORKSPACE_ID = 'side-workspace';

// 과거(완료된) 스프린트
const sprint1: Sprint = {
  id: 'sprint-1',
  workspaceId: SIDE_PROJECT_WORKSPACE_ID,
  name: 'Sprint 1',
  startDate: '2025-06-17',
  endDate: '2025-06-30',
  daysLeft: 0,
  totalPoints: 38,
  completedPoints: 34,
};

// 현재 진행 중 스프린트
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

// 워크스페이스의 스프린트 목록(선택기용) — 시간순
export const mockSprints: Sprint[] = [sprint1, currentSprint];
