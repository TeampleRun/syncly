// 스프린트 도메인 모델 — 기간·포인트 메타만 가진다.
// 업무(Task)는 Sprint가 소유하지 않고, Task.sprintId로 이 스프린트를 참조한다.
// 스프린트 업무 조회는 getSprintTasks(sprintId), 백로그는 getBacklogTasks(workspaceId)를 쓴다.
export interface Sprint {
  id: string;
  /** 소유 워크스페이스 — 스프린트/백로그를 이 값으로 조회한다 */
  workspaceId: string;
  name: string;
  /** ISO 날짜 (YYYY-MM-DD) */
  startDate: string;
  endDate: string;
  daysLeft: number;
  /** 스프린트 계획 포인트 총합 */
  totalPoints: number;
  /** 완료 포인트 */
  completedPoints: number;
}

export interface VelocityPoint {
  sprint: string;
  planned: number;
  completed: number;
}

/** 벨로시티 차트 Y축 최댓값 */
export const VELOCITY_MAX = 60;
