import { MeetingNotesPage } from '@/views/meeting-notes';
import { assertWorkspaceRouteAccess } from '@/entities/workspace';

interface WorkspaceMeetingNotesPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

export default async function WorkspaceMeetingNotesPage({
  params,
}: WorkspaceMeetingNotesPageProps) {
  const { workspaceId } = await params;
  await assertWorkspaceRouteAccess(workspaceId, 'meeting-notes');

  return <MeetingNotesPage workspaceId={workspaceId} />;
}
