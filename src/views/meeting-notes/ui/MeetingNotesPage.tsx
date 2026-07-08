import { Plus_Jakarta_Sans } from 'next/font/google';
import { getMockMeetingNotesByWorkspaceId } from '@/entities/meeting-note';
import { MeetingNotesList } from '@/features/manage-meeting-notes';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

interface MeetingNotesPageProps {
  workspaceId: string;
}

export default function MeetingNotesPage({ workspaceId }: MeetingNotesPageProps) {
  const meetingNotes = getMockMeetingNotesByWorkspaceId(workspaceId);

  return (
    <div className={`${jakarta.className} bg-brand-surface min-h-full`}>
      <MeetingNotesList workspaceId={workspaceId} meetingNotes={meetingNotes} />
    </div>
  );
}
