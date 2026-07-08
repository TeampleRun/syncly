// workspace 엔티티 Public API
export type { Workspace, WorkspacePurpose, WorkspaceSummary } from './model/workspace.types';
export { getMockWorkspaceById, mockWorkspace } from './model/mock-workspace';
export { WORKSPACE_PURPOSE_META, FALLBACK_PURPOSE_META } from './config/purpose';
export { getMyWorkspaces } from './api/get-my-workspaces';
