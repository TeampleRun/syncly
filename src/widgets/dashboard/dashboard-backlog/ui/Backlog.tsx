// 백로그 위젯 — backlog-item 엔티티(BacklogItemRow)를 리스트로 조립
import { BacklogItemRow, mockBacklog } from '@/entities/backlog-item';
import { WidgetCard, WidgetCardAction, WidgetCardHeader } from '@/shared/ui/widget-card';

export default function Backlog() {
  return (
    <WidgetCard>
      <WidgetCardHeader title="백로그" action={<WidgetCardAction>보드</WidgetCardAction>} />
      <ul className="flex flex-col gap-2">
        {mockBacklog.map((item) => (
          <BacklogItemRow key={item.title} item={item} />
        ))}
      </ul>
    </WidgetCard>
  );
}
