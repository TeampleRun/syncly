// 워크스페이스 목적에 맞지 않는 전용 모듈 URL의 직접 접근을 서버에서 차단합니다.
import { redirect } from 'next/navigation';
import { getWorkspaceById } from '../api/get-workspace-by-id';
import type { WorkspacePurpose } from '../model/workspace.types';

type WorkspaceProtectedRoute =
  | 'meeting-notes'
  | 'notices'
  | 'progress-chart'
  | 'project-management'
  | 'sprint-board'
  | 'work-schedule';

// 각 목적에서 제공하는 전용 모듈 라우트를 정의합니다. 공통 모듈은 별도 보호가 필요하지 않습니다.
const workspaceRoutePurposes: Record<WorkspaceProtectedRoute, readonly WorkspacePurpose[]> = {
  'meeting-notes': ['team-project', 'side-project'],
  notices: ['team-project', 'store-operation'],
  'progress-chart': ['team-project', 'side-project'],
  'project-management': ['team-project'],
  'sprint-board': ['side-project'],
  'work-schedule': ['store-operation'],
};

export async function assertWorkspaceRouteAccess(
  workspaceId: string,
  route: WorkspaceProtectedRoute,
): Promise<void> {
  const workspace = await getWorkspaceById(workspaceId);

  if (!workspace || !workspaceRoutePurposes[route].includes(workspace.purpose)) {
    redirect(`/workspaces/${workspaceId}/unavailable`);
  }
}
