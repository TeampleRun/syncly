// 백로그 위젯 — backlog-item 모델을 받아 대시보드용 compact 리스트로 렌더
import { BACKLOG_PRIORITY_COLOR, mockBacklog } from '@/entities/side-project/backlog-item';
import { WidgetCard, WidgetCardAction, WidgetCardHeader } from '@/shared/side-project/ui/widget-card';

export default function Backlog() {
  return (
    <WidgetCard>
      <WidgetCardHeader title="백로그" action={<WidgetCardAction>보드</WidgetCardAction>} />
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
