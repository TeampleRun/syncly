// 최근 회의록 위젯 — 타일 크기에 따라 밀도가 다른 변형을 렌더
//  · sm: 가장 최근 회의록 1건(제목만)
//  · md: 리스트(제목 + 작성일)
//  · lg: 총 개수 + 리스트(제목 + 본문 미리보기 + 작성일)
import { FileText } from 'lucide-react';

import { mockMeetingNotes } from '@/entities/side-project/meeting-note';
import type { WidgetSize } from '@/shared/dashboard/lib/widget-size';
import { WidgetCard, WidgetCardAction, WidgetCardHeader } from '@/shared/dashboard/ui/widget-card';

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

  if (size === 'lg') {
    return (
      <WidgetCard>
        {header}
        <p className="text-brand-muted mb-2 text-xs">총 {mockMeetingNotes.length}개의 회의록</p>
        <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
          {mockMeetingNotes.map((note) => (
            <li key={note.id} className="bg-brand-surface flex items-start gap-2 rounded-xl p-3">
              <FileText className="text-brand-muted mt-0.5 size-4 shrink-0" />
              <div className="min-w-0">
                <p className="text-brand-ink truncate text-sm font-semibold">{note.title}</p>
                <p className="text-brand-muted truncate text-xs">{note.summary}</p>
                <p className="text-brand-muted mt-0.5 text-[11px]">{note.date}</p>
              </div>
            </li>
          ))}
        </ul>
      </WidgetCard>
    );
  }

  // md — 리스트(제목 + 작성일)
  return (
    <WidgetCard>
      {header}
      <ul className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
        {mockMeetingNotes.map((note) => (
          <li key={note.id} className="flex items-start gap-2">
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
