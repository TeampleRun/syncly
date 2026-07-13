import { notFound, redirect } from 'next/navigation';
import { getWorkspaceById } from '@/entities/workspace/api/get-workspace-by-id';

interface WorkspaceHomePageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

export default async function WorkspaceHomePage({ params }: WorkspaceHomePageProps) {
  const { workspaceId } = await params;
  const workspace = await getWorkspaceById(workspaceId);

  if (!workspace) {
    notFound();
  }

  if (workspace.purpose === 'store-operation') {
    redirect(`/workspaces/${workspaceId}/work-schedule`);
  }

  redirect(`/workspaces/${workspaceId}/project-management`);
}
