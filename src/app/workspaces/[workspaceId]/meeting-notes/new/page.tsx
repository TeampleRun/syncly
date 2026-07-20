import { NewMeetingNotePage } from '@/views/meeting-notes';
import { assertWorkspaceRouteAccess } from '@/entities/workspace';

interface WorkspaceNewMeetingNotePageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

export default async function WorkspaceNewMeetingNotePage({
  params,
}: WorkspaceNewMeetingNotePageProps) {
  const { workspaceId } = await params;
  await assertWorkspaceRouteAccess(workspaceId, 'meeting-notes');

  return <NewMeetingNotePage workspaceId={workspaceId} />;
}
