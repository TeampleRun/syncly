// 캘린더 위젯 — 월간 달력. 오늘 날짜 강조 + 이벤트 점 표시.
//  · sm: 오늘 날짜 + 이벤트 건수 요약
//  · md/lg: 월간 그리드(요일 헤더 + 날짜 셀)
import { mockCalendar } from '@/entities/side-project/schedule-event';
import { cn } from '@/shared/lib/utils';
import type { WidgetSize } from '@/shared/dashboard/lib/widget-size';
import { WidgetCard, WidgetCardAction, WidgetCardHeader } from '@/shared/dashboard/ui/widget-card';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

// 해당 월의 날짜 셀을 요일 기준으로 배치(앞뒤 빈칸 포함, 7의 배수로 패딩)
function buildMonthCells(year: number, month: number): (number | null)[] {
  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: (number | null)[] = Array.from({ length: firstWeekday }, () => null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function Calendar({ size = 'md' }: { size?: WidgetSize }) {
  const { year, month, today, eventDays } = mockCalendar;

  const header = (
    <WidgetCardHeader
      title={`${month}월 캘린더`}
      action={<WidgetCardAction>전체 보기</WidgetCardAction>}
    />
  );

  if (size === 'sm') {
    return (
      <WidgetCard>
        {header}
        <div className="flex flex-1 flex-col justify-center">
          <p className="text-brand text-3xl font-extrabold">{today ?? '-'}일</p>
          <p className="text-brand-muted mt-1 text-xs">
            {month}월 · 일정 {eventDays.length}건
          </p>
        </div>
      </WidgetCard>
    );
  }

  const cells = buildMonthCells(year, month);

  return (
    <WidgetCard>
      {header}
      <div className="grid min-h-0 flex-1 grid-cols-7 gap-y-1 overflow-y-auto text-center">
        {WEEKDAYS.map((label, col) => (
          <span
            key={label}
            className={cn(
              'text-[11px] font-semibold',
              col === 0 && 'text-[#fb2c36]',
              col === 6 && 'text-[#2b7fff]',
              col > 0 && col < 6 && 'text-brand-muted',
            )}
          >
            {label}
          </span>
        ))}

        {cells.map((day, idx) => {
          if (day === null) return <span key={`empty-${idx}`} />;
          const col = idx % 7;
          const isToday = day === today;
          const hasEvent = eventDays.includes(day);
          return (
            <div key={day} className="flex flex-col items-center gap-0.5 py-0.5">
              <span
                className={cn(
                  'flex size-6 items-center justify-center rounded-full text-xs',
                  isToday && 'bg-[#2b7fff] font-semibold text-white',
                  !isToday && col === 0 && 'text-[#fb2c36]',
                  !isToday && col === 6 && 'text-[#2b7fff]',
                  !isToday && col > 0 && col < 6 && 'text-brand-ink',
                )}
              >
                {day}
              </span>
              <span
                className={cn('size-1 rounded-full', hasEvent ? 'bg-[#2b7fff]' : 'bg-transparent')}
              />
            </div>
          );
        })}
      </div>
    </WidgetCard>
  );
}
