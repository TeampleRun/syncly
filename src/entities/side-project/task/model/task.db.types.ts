// task 도메인 DB 타입 — 자동 생성 스키마(database.types)에서 파생한다.
// 스키마 변경 시 `npm run gen:types` 실행하면 전부 최신화된다.
import type { GenericTables } from '@/shared/model/supabase.types';

/** tasks 테이블 Row — select 결과. 담당자 표시명은 members에서 해석하므로 profiles 조인은 하지 않는다. */
export type TaskRow = GenericTables<'tasks'>;
