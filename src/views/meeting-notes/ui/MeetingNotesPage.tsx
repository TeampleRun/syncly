import { getMockMeetingNotesByWorkspaceId } from '@/entities/meeting-note';
import { MeetingNotesList } from '@/features/manage-meeting-notes';
import { plusJakartaSans } from '@/shared/lib/fonts';

interface MeetingNotesPageProps {
  workspaceId: string;
}

export default function MeetingNotesPage({ workspaceId }: MeetingNotesPageProps) {
  const meetingNotes = getMockMeetingNotesByWorkspaceId(workspaceId);

  return (
    <div className={`${plusJakartaSans.className} bg-brand-surface min-h-full`}>
      <MeetingNotesList workspaceId={workspaceId} meetingNotes={meetingNotes} />
    </div>
  );
}
