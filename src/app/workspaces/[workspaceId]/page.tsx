import { redirect } from 'next/navigation';
import { getMockWorkspaceById } from '@/entities/workspace';

interface WorkspaceHomePageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

export default async function WorkspaceHomePage({
  params,
}: WorkspaceHomePageProps) {
  const { workspaceId } = await params;
  const workspace = getMockWorkspaceById(workspaceId);

  if (workspace.purpose === 'store-operation') {
    redirect(`/workspaces/${workspaceId}/work-schedule`);
  }

  redirect(`/workspaces/${workspaceId}/project-management`);
}
