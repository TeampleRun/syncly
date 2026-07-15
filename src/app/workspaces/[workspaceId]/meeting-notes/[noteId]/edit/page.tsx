import { EditMeetingNotePage } from '@/views/meeting-notes';

interface WorkspaceEditMeetingNotePageProps {
  params: Promise<{
    workspaceId: string;
    noteId: string;
  }>;
}

export default async function WorkspaceEditMeetingNotePage({
  params,
}: WorkspaceEditMeetingNotePageProps) {
  const { workspaceId, noteId } = await params;

  return <EditMeetingNotePage workspaceId={workspaceId} meetingNoteId={noteId} />;
}
