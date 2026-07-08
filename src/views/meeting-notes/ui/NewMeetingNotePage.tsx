import { Plus_Jakarta_Sans } from 'next/font/google';
import { MeetingNoteForm } from '@/features/manage-meeting-notes';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

interface NewMeetingNotePageProps {
  workspaceId: string;
}

export default function NewMeetingNotePage({ workspaceId }: NewMeetingNotePageProps) {
  return (
    <div className={`${jakarta.className} bg-brand-surface min-h-full`}>
      <MeetingNoteForm workspaceId={workspaceId} />
    </div>
  );
}
