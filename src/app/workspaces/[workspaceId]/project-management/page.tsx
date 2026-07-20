import { ProjectManagementPage } from '@/views/project-management';
import { assertWorkspaceRouteAccess } from '@/entities/workspace';

interface WorkspaceProjectManagementPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

export default async function WorkspaceProjectManagementPage({
  params,
}: WorkspaceProjectManagementPageProps) {
  const { workspaceId } = await params;
  await assertWorkspaceRouteAccess(workspaceId, 'project-management');

  return <ProjectManagementPage workspaceId={workspaceId} />;
}
