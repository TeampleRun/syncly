// Supabase DB 타입 Generic 헬퍼 — 자동 생성 파일(database.types.ts)에서 도메인 타입을 꺼내 쓴다.
// 자동 생성 파일을 직접 import하지 않고 이 헬퍼를 단일 진입점으로 사용한다.
// 도메인별 사용처: entities/<도메인>/model/<도메인>.db.types.ts (예: entities/workspace)
import type { Database } from './database.types';

type PublicSchema = Database['public'];

/** 테이블 조회(Row) 타입 — 예: GenericTables<'workspaces'> */
export type GenericTables<T extends keyof PublicSchema['Tables']> =
  PublicSchema['Tables'][T]['Row'];

/** 테이블 insert 페이로드 타입 — default/자동 생성 컬럼은 옵셔널 */
export type GenericTablesInsert<T extends keyof PublicSchema['Tables']> =
  PublicSchema['Tables'][T]['Insert'];

/** 테이블 update 페이로드 타입 — 모든 컬럼 옵셔널 */
export type GenericTablesUpdate<T extends keyof PublicSchema['Tables']> =
  PublicSchema['Tables'][T]['Update'];

/** 네이티브 ENUM 타입 — 예: GenericEnums<'task_status'> = 'todo' | 'in_progress' | 'done' */
export type GenericEnums<T extends keyof PublicSchema['Enums']> = PublicSchema['Enums'][T];

/** RPC 인자 타입 — 예: GenericFunctionArgs<'get_my_workspaces'> */
export type GenericFunctionArgs<T extends keyof PublicSchema['Functions']> =
  PublicSchema['Functions'][T]['Args'];

/** RPC 반환 타입 — 예: GenericFunctionReturns<'get_my_workspaces'> */
export type GenericFunctionReturns<T extends keyof PublicSchema['Functions']> =
  PublicSchema['Functions'][T]['Returns'];
