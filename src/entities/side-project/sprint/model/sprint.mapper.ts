// get_sprints RPC row → Sprint 엔티티 매퍼 + 쓰기 방향(입력 → insert/update 페이로드).
// 파생값(daysLeft, total/completedPoints)은 RPC가 SQL에서 계산해 반환하므로 읽기 매퍼는 필드 변환만 한다(순수 함수).
import type { GenericTablesInsert, GenericTablesUpdate } from '@/shared/model/supabase.types';
import type { Sprint } from './sprint.types';
import type { SprintRpcRow } from './sprint.db.types';
import type { SprintInput } from './sprint.schema';

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

/** 검증된 입력 → sprints insert 페이로드. */
export function toSprintInsert(
  input: SprintInput,
  workspaceId: string,
): GenericTablesInsert<'sprints'> {
  return {
    workspace_id: workspaceId,
    name: input.name,
    start_date: input.startDate,
    end_date: input.endDate,
  };
}

/** 검증된 입력 → sprints update 페이로드. */
export function toSprintUpdate(input: SprintInput): GenericTablesUpdate<'sprints'> {
  return {
    name: input.name,
    start_date: input.startDate,
    end_date: input.endDate,
  };
}
