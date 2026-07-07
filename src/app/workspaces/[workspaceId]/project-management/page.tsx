import { ProjectManagementPage } from '@/views/project-management';

interface WorkspaceProjectManagementPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

export default async function WorkspaceProjectManagementPage({
  params,
}: WorkspaceProjectManagementPageProps) {
  const { workspaceId } = await params;

  return <ProjectManagementPage workspaceId={workspaceId} />;
}
