import { getMeetingNotes } from '@/entities/meeting-note';
import { MeetingNotesList } from '@/features/manage-meeting-notes';

interface MeetingNotesPageProps {
  workspaceId: string;
}

export default async function MeetingNotesPage({ workspaceId }: MeetingNotesPageProps) {
  const { meetingNotes, viewer } = await getMeetingNotes(workspaceId);

  return (
    <div className="bg-brand-surface min-h-full">
      <MeetingNotesList workspaceId={workspaceId} meetingNotes={meetingNotes} viewer={viewer} />
    </div>
  );
}
