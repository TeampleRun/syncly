import { notFound } from 'next/navigation';
import { getMeetingNote } from '@/entities/meeting-note';
import { MeetingNoteForm } from '@/features/manage-meeting-notes';
import { plusJakartaSans } from '@/shared/lib/fonts';

interface EditMeetingNotePageProps {
  workspaceId: string;
  meetingNoteId: string;
}

export default async function EditMeetingNotePage({
  workspaceId,
  meetingNoteId,
}: EditMeetingNotePageProps) {
  const meetingNote = await getMeetingNote(workspaceId, meetingNoteId);

  if (!meetingNote) {
    notFound();
  }

  return (
    <div className={`${plusJakartaSans.className} bg-brand-surface min-h-full`}>
      <MeetingNoteForm workspaceId={workspaceId} meetingNote={meetingNote} />
    </div>
  );
}
