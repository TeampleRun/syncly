import { NewMeetingNotePage } from '@/views/meeting-notes';

interface WorkspaceNewMeetingNotePageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

export default async function WorkspaceNewMeetingNotePage({
  params,
}: WorkspaceNewMeetingNotePageProps) {
  const { workspaceId } = await params;

  return <NewMeetingNotePage workspaceId={workspaceId} />;
}
