import { notFound } from 'next/navigation';
import { getMockWorkspaceById } from '@/entities/workspace';
import { SettingsView } from '@/views/settings';
import { parseSettingsTab } from '@/views/settings';

interface WorkspaceSettingsPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
  searchParams: Promise<{
    tab?: string;
  }>;
}

export default async function WorkspaceSettingsPage({
  params,
  searchParams,
}: WorkspaceSettingsPageProps) {
  const { workspaceId } = await params;
  const { tab } = await searchParams;
  const workspace = getMockWorkspaceById(workspaceId);

  if (!workspace) {
    notFound();
  }

  return (
    <SettingsView
      workspace={workspace}
      workspaceId={workspaceId}
      activeTab={parseSettingsTab(tab)}
    />
  );
}
