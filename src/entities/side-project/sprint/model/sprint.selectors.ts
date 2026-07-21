// 스프린트 선택 로직 — 데이터에서 "현재 스프린트"를 판정한다(하드코딩 상수에 의존하지 않음).
// 진행 중(오늘이 기간 안) 스프린트를 우선하고, 없으면 가장 최근 시작한 스프린트를 고른다.
// 실 DB에서는 이 규칙이 `where start_date<=now()<=end_date` → 없으면 `order by start_date desc limit 1`에 대응한다.
import type { Sprint, VelocityPoint } from './sprint.types';

/**
 * 스프린트 목록에서 벨로시티 추이를 파생한다 — 벨로시티는 sprints 집계이므로 별도 상수를 두지 않는다.
 * 실 DB에서는 `select name, total_points, completed_points from sprints order by start_date`에 대응한다.
 */
export function selectVelocity(sprints: Sprint[]): VelocityPoint[] {
  return sprints.map((sprint) => ({
    sprint: sprint.name,
    planned: sprint.totalPoints,
    completed: sprint.completedPoints,
  }));
}

/**
 * 벨로시티 차트 Y축 최댓값을 데이터에서 파생한다 — 실 포인트에 맞춰 축을 스케일한다.
 * 가장 큰 계획/완료 포인트를 10 단위로 올림하고, 데이터가 없으면 기본 눈금(10)을 쓴다.
 * 이렇게 하면 포인트가 상수보다 크면 막대가 잘리고, 작으면 차트가 납작해지는 문제를 막는다.
 */
export function selectVelocityMax(points: VelocityPoint[]): number {
  const peak = points.reduce((max, point) => Math.max(max, point.planned, point.completed), 0);
  if (peak <= 0) return 10;
  return Math.ceil(peak / 10) * 10;
}

export function resolveCurrentSprint(sprints: Sprint[]): Sprint | undefined {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate(),
  ).padStart(2, '0')}`; // 로컬 타임존 기준 YYYY-MM-DD
  const ongoing = sprints.find((sprint) => sprint.startDate <= today && today <= sprint.endDate);
  if (ongoing) return ongoing;

  // 진행 중이 없으면 가장 최근 시작한 스프린트 (원본 불변)
  return [...sprints].sort((a, b) => b.startDate.localeCompare(a.startDate))[0];
}

/**
 * 화면에 표시할 스프린트를 판정한다 — 선택 id(URL ?sprint=id 등)가 유효하면 그 스프린트,
 * 없거나 유효하지 않으면 현재 스프린트로 폴백한다(진행 중 우선 → 없으면 최신).
 * 스프린트 보드/진행률 차트가 공유하는 선택 규칙을 한 곳에 둔다.
 */
export function resolveSelectedSprint(
  sprints: Sprint[],
  selectedSprintId: string | undefined,
): Sprint | undefined {
  return sprints.find((sprint) => sprint.id === selectedSprintId) ?? resolveCurrentSprint(sprints);
}
