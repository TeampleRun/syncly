import { MeetingNoteForm } from '@/features/manage-meeting-notes';

interface NewMeetingNotePageProps {
  workspaceId: string;
}

export default function NewMeetingNotePage({ workspaceId }: NewMeetingNotePageProps) {
  return (
    <div className="bg-brand-surface min-h-full">
      <MeetingNoteForm workspaceId={workspaceId} />
    </div>
  );
}
