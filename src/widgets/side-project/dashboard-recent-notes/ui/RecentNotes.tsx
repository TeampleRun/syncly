// 최근 회의록 위젯 — 타일 크기에 따라 밀도가 다른 변형을 렌더
//  · sm: 가장 최근 회의록 1건(제목만)
//  · md/lg: 회의록 리스트(제목 + 작성일)
import { FileText } from 'lucide-react';

import { mockMeetingNotes } from '@/entities/side-project/meeting-note';
import type { WidgetSize } from '@/shared/side-project/lib/widget-size';
import { WidgetCard, WidgetCardAction, WidgetCardHeader } from '@/shared/side-project/ui/widget-card';

const header = (
  <WidgetCardHeader title="최근 회의록" action={<WidgetCardAction>전체 보기</WidgetCardAction>} />
);

export default function RecentNotes({ size = 'md' }: { size?: WidgetSize }) {
  if (size === 'sm') {
    const latest = mockMeetingNotes[0];
    return (
      <WidgetCard>
        {header}
        <div className="flex items-center gap-2">
          <FileText className="text-brand-muted size-4 shrink-0" />
          <span className="text-brand-ink truncate text-sm font-semibold">{latest.title}</span>
        </div>
      </WidgetCard>
    );
  }

  // md / lg — 리스트
  return (
    <WidgetCard>
      {header}
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
