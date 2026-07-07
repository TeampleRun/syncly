// 백로그 위젯 — backlog-item 모델을 받아 대시보드용 compact 리스트로 렌더
import { BACKLOG_PRIORITY_COLOR, mockBacklog } from '@/entities/side-project/backlog-item';
import { WidgetCard, WidgetCardAction, WidgetCardHeader } from '@/shared/side-project/ui/widget-card';
import { mockMeetingNotes } from '@/entities/side-project/meeting-note';
import { FileText } from 'lucide-react';
import type { WidgetSize } from '@/shared/side-project/lib/widget-size';

const header = (
  <WidgetCardHeader title="백로그" action={<WidgetCardAction>보드</WidgetCardAction>} />
);
export default function Backlog({ size = 'md' }: { size?: WidgetSize }) {
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

  return (
    <WidgetCard>
      {header}
      <ul className="flex flex-col gap-2">
        {mockBacklog.map((item) => (
          <li key={item.title} className="flex items-center gap-2">
            <span
              className="size-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: BACKLOG_PRIORITY_COLOR[item.priority] }}
            />
            <span className="text-brand-ink min-w-0 flex-1 truncate text-sm">{item.title}</span>
            <span className="text-brand-muted text-[10px]">{item.point}pt</span>
          </li>
        ))}
      </ul>
    </WidgetCard>
  );
}
