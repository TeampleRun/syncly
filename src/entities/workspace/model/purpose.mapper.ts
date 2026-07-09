// DB(snake_case) ↔ 프론트(hyphen) purpose 표기 매퍼
// TODO: 프론트 WorkspacePurpose를 snake_case로 통일하는 리팩터링이 끝나면 이 파일을 제거한다
import type { WorkspacePurposeDb } from './workspace.db.types';
import type { WorkspacePurpose } from './workspace.types';

const DB_TO_UI: Record<WorkspacePurposeDb, WorkspacePurpose> = {
  team_project: 'team-project',
  side_project: 'side-project',
  store_operation: 'store-operation',
};

const UI_TO_DB: Record<WorkspacePurpose, WorkspacePurposeDb> = {
  'team-project': 'team_project',
  'side-project': 'side_project',
  'store-operation': 'store_operation',
};

export const toUiPurpose = (purpose: WorkspacePurposeDb): WorkspacePurpose => DB_TO_UI[purpose];

export const toDbPurpose = (purpose: WorkspacePurpose): WorkspacePurposeDb => UI_TO_DB[purpose];
