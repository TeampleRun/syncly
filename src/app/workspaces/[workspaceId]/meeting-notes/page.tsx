import { MeetingNotesPage } from '@/views/meeting-notes';

interface WorkspaceMeetingNotesPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

export default async function WorkspaceMeetingNotesPage({
  params,
}: WorkspaceMeetingNotesPageProps) {
  const { workspaceId } = await params;

  return <MeetingNotesPage workspaceId={workspaceId} />;
}
