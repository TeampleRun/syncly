// get_sprints RPC row → Sprint 엔티티 매퍼.
// 파생값(daysLeft, total/completedPoints)은 RPC가 SQL에서 이미 계산해 반환하므로,
// 매퍼는 snake_case→camelCase 필드 변환만 담당한다(순수 함수).
import type { Sprint } from './sprint.types';
import type { SprintRpcRow } from './sprint.db.types';

/** get_sprints RPC row → Sprint 엔티티. */
export function toSprint(row: SprintRpcRow): Sprint {
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    name: row.name,
    startDate: row.start_date,
    endDate: row.end_date,
    daysLeft: row.days_left,
    totalPoints: row.total_points,
    completedPoints: row.completed_points,
  };
}
