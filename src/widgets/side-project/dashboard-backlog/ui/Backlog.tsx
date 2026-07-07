// 백로그 위젯 — 타일 크기에 따라 밀도가 다른 변형을 렌더
//  · sm: 최상위 항목 1건 + 외 N건
//  · md/lg: 우선순위 점 + 항목 + 포인트 리스트(넘치면 스크롤)
import { BACKLOG_PRIORITY_COLOR, mockBacklog } from '@/entities/side-project/backlog-item';
import type { WidgetSize } from '@/shared/dashboard/lib/widget-size';
import { WidgetCard, WidgetCardAction, WidgetCardHeader } from '@/shared/dashboard/ui/widget-card';

const header = (
  <WidgetCardHeader title="백로그" action={<WidgetCardAction>보드</WidgetCardAction>} />
);

export default function Backlog({ size = 'md' }: { size?: WidgetSize }) {
  if (size === 'sm') {
    const [top, ...rest] = mockBacklog;
    return (
      <WidgetCard>
        {header}
        <div className="flex items-center gap-2">
          <span
            className="size-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: BACKLOG_PRIORITY_COLOR[top.priority] }}
          />
          <span className="text-brand-ink min-w-0 flex-1 truncate text-sm">{top.title}</span>
          {rest.length > 0 && <span className="text-brand-muted text-xs">외 {rest.length}건</span>}
        </div>
      </WidgetCard>
    );
  }

  return (
    <WidgetCard>
      {header}
      <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
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
