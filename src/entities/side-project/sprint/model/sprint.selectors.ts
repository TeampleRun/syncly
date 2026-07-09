// 스프린트 선택 로직 — 데이터에서 "현재 스프린트"를 판정한다(하드코딩 상수에 의존하지 않음).
// 진행 중(오늘이 기간 안) 스프린트를 우선하고, 없으면 가장 최근 시작한 스프린트를 고른다.
// 실 DB에서는 이 규칙이 `where start_date<=now()<=end_date` → 없으면 `order by start_date desc limit 1`에 대응한다.
import type { Sprint } from './sprint.types';

export function resolveCurrentSprint(sprints: Sprint[]): Sprint | undefined {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const ongoing = sprints.find((sprint) => sprint.startDate <= today && today <= sprint.endDate);
  if (ongoing) return ongoing;

  // 진행 중이 없으면 가장 최근 시작한 스프린트 (원본 불변)
  return [...sprints].sort((a, b) => b.startDate.localeCompare(a.startDate))[0];
}
