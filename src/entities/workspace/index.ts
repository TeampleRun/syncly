// workspace 엔티티 Public API
export type { Workspace, WorkspacePurpose, WorkspaceSummary } from './model/workspace.types';
export { mockWorkspace } from './model/mock-workspace';
export { WORKSPACE_PURPOSE_META, FALLBACK_PURPOSE_META } from './config/purpose';
export {
  WORKSPACE_TEMPLATE_DETAIL,
  WORKSPACE_TEMPLATE_ORDER,
  type WorkspaceTemplateDetail,
} from './config/template';
export { getMyWorkspaces } from './api/get-my-workspaces';
export { createWorkspace, type CreateWorkspaceInput } from './api/create-workspace';
