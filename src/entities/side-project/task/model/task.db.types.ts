// task 도메인 DB 타입 — 자동 생성 스키마(database.types)에서 파생한다.
// 스키마 변경 시 `npm run gen:types` 실행하면 전부 최신화된다.
import type { GenericTables } from '@/shared/model/supabase.types';

/** tasks 테이블 Row — select 결과 */
export type TaskRow = GenericTables<'tasks'>;

/**
 * 담당자 조인을 포함한 tasks Row.
 * Supabase 쿼리 `.select('*, assignee:profiles(real_name)')`의 반환 형태에 대응한다.
 * assignee_id가 null이거나 조인이 비면 assignee = null.
 */
export type TaskWithAssigneeRow = TaskRow & {
  assignee: { real_name: string } | null;
};
