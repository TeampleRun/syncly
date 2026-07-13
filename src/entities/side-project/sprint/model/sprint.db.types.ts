// sprint 도메인 DB 타입 — 자동 생성 스키마(database.types)에서 파생한다.
// 스키마 변경 시 `npm run gen:types` 실행하면 전부 최신화된다.
import type { GenericFunctionReturns, GenericTables } from '@/shared/model/supabase.types';

/** sprints 테이블 Row — 직접 select 시 결과(파생 집계 없음) */
export type SprintRow = GenericTables<'sprints'>;

/**
 * get_sprints RPC 반환 행 — 스프린트 메타 + 집계(total/completed_points) + days_left를 SQL에서 계산해 반환.
 * 스프린트 조회는 이 RPC를 쓰므로 매퍼(toSprint)의 입력은 SprintRow가 아니라 이 타입이다.
 */
export type SprintRpcRow = GenericFunctionReturns<'get_sprints'>[number];
