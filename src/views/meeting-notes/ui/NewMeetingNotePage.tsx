import { MeetingNoteForm } from '@/features/manage-meeting-notes';
import { plusJakartaSans } from '@/shared/lib/fonts';

interface NewMeetingNotePageProps {
  workspaceId: string;
}

export default function NewMeetingNotePage({ workspaceId }: NewMeetingNotePageProps) {
  return (
    <div className={`${plusJakartaSans.className} bg-brand-surface min-h-full`}>
      <MeetingNoteForm workspaceId={workspaceId} />
    </div>
  );
}
