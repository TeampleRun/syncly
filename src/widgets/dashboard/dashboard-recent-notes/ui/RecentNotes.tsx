// 최근 회의록 위젯 — meeting-note 모델을 받아 대시보드용 리스트로 렌더
import { FileText } from 'lucide-react';

import { mockMeetingNotes } from '@/entities/meeting-note';
import { WidgetCard, WidgetCardAction, WidgetCardHeader } from '@/shared/ui/widget-card';

export default function RecentNotes() {
  return (
    <WidgetCard>
      <WidgetCardHeader title="최근 회의록" action={<WidgetCardAction>전체</WidgetCardAction>} />
      <ul className="flex flex-col gap-3">
        {mockMeetingNotes.map((note) => (
          <li key={note.title} className="flex items-start gap-2">
            <FileText className="text-brand-muted mt-0.5 size-4 shrink-0" />
            <div className="min-w-0">
              <p className="text-brand-ink truncate text-sm font-semibold">{note.title}</p>
              <p className="text-brand-muted text-[11px]">{note.date}</p>
            </div>
          </li>
        ))}
      </ul>
    </WidgetCard>
  );
}
