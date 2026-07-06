// 최근 회의록 위젯 — meeting-note 엔티티(MeetingNoteRow)를 리스트로 조립
import { MeetingNoteRow, mockMeetingNotes } from '@/entities/meeting-note';
import { WidgetCard, WidgetCardAction, WidgetCardHeader } from '@/shared/ui/widget-card';

export default function RecentNotes() {
  return (
    <WidgetCard>
      <WidgetCardHeader title="최근 회의록" action={<WidgetCardAction>전체</WidgetCardAction>} />
      <ul className="flex flex-col gap-3">
        {mockMeetingNotes.map((note) => (
          <MeetingNoteRow key={note.title} note={note} />
        ))}
      </ul>
    </WidgetCard>
  );
}
