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
