'use client';

// 오늘 일정 위젯 — 타일 크기에 따라 밀도가 다른 변형을 렌더
//  · sm: 다음 일정 1건(액센트 바 + 제목 + 시간 + 외 N건)
//  · md: 3건 리스트
//  · lg: 전체 리스트 (일정 유형별 액센트 바 색상 — 마감=빨강)
import { useCalendarEventsByWorkspaceId } from '@/entities/calendar-event';
import {
  selectTodayScheduleEvents,
  SCHEDULE_TYPE_COLOR,
} from '@/entities/side-project/schedule-event';
import type { WidgetSize } from '@/shared/dashboard/lib/widget-size';
import { WidgetStateMessage } from '@/shared/dashboard/ui/widget-state-message';
import { WidgetCard, WidgetCardAction, WidgetCardHeader } from '@/shared/dashboard/ui/widget-card';

const header = (
  <WidgetCardHeader title="오늘 일정" action={<WidgetCardAction>전체 보기</WidgetCardAction>} />
);

export default function TodaySchedule({
  workspaceId,
  size = 'md',
}: {
  workspaceId: string;
  size?: WidgetSize;
}) {
  const calendarEventsQuery = useCalendarEventsByWorkspaceId(workspaceId);
  const todaySchedule = selectTodayScheduleEvents(calendarEventsQuery.data ?? []);

  if (calendarEventsQuery.isPending) {
    return <WidgetStateMessage header={header} message="오늘 일정을 불러오는 중..." />;
  }

  if (calendarEventsQuery.isError) {
    return <WidgetStateMessage header={header} message="오늘 일정을 불러오지 못했습니다." />;
  }

  if (todaySchedule.length === 0) {
    return <WidgetStateMessage header={header} message="오늘 등록된 일정이 없습니다." />;
  }

  if (size === 'sm') {
    const [next, ...rest] = todaySchedule;
    return (
      <WidgetCard>
        {header}
        <div className="flex gap-3">
          <span
            className="w-1 shrink-0 rounded-full"
            style={{ backgroundColor: SCHEDULE_TYPE_COLOR[next.type] }}
          />
          <div className="min-w-0">
            <p className="text-brand-muted text-xs">다음 일정</p>
            <p className="text-brand-ink mt-0.5 truncate text-sm font-semibold">{next.title}</p>
            <p className="mt-1 text-xs">
              <span className="text-brand">{next.time}</span>
              {rest.length > 0 && <span className="text-brand-muted"> · 외 {rest.length}건</span>}
            </p>
          </div>
        </div>
      </WidgetCard>
    );
  }

  // md: 3건, lg: 전체
  const events = size === 'md' ? todaySchedule.slice(0, 3) : todaySchedule;
  return (
    <WidgetCard>
      {header}
      <ul className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
        {events.map((event) => (
          <li key={event.id} className="flex items-start gap-3">
            <span
              className="w-1 shrink-0 self-stretch rounded-full"
              style={{ backgroundColor: SCHEDULE_TYPE_COLOR[event.type] }}
            />
            <div className="min-w-0">
              <p className="text-brand-ink truncate text-sm font-semibold">{event.title}</p>
              <p className="text-brand-muted text-xs">{event.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </WidgetCard>
  );
}
