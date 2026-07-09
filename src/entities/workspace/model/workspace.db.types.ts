// workspace 도메인 DB 타입 — 자동 생성 스키마(database.types)에서 파생한다.
// 스키마 변경 시 `npm run gen:types` 실행하면 전부 최신화된다.
import type {
  GenericEnums,
  GenericTables,
  GenericTablesInsert,
  GenericTablesUpdate,
} from '@/shared/model/supabase.types';

/** workspaces 테이블 Row — select 결과 */
export type WorkspaceRow = GenericTables<'workspaces'>;

/** workspaces insert 페이로드 — default 컬럼(id, created_at 등)은 옵셔널 */
export type WorkspaceInsert = GenericTablesInsert<'workspaces'>;

/** workspaces update 페이로드 */
export type WorkspaceUpdate = GenericTablesUpdate<'workspaces'>;

// DB enum: 'team_project' | 'side_project' | 'store_operation'
// 프론트 WorkspacePurpose(hyphen)는 snake_case 통일 리팩터링 때 이 타입으로 교체한다.
export type WorkspacePurposeDb = GenericEnums<'workspace_purpose'>;
