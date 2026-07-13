'use client';

// 업무 스케줄 위젯 — 매장 운영 워크스페이스의 오늘 근무 현황과 요일별 요약을 보여준다.
//  · sm: 오늘 근무 인원 + 대표 근무 유형
//  · md: 오늘 근무 유형별 인원
//  · lg: 오늘 근무 유형별 인원 + 다음 4일 근무 인원
import { ClipboardList } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import {
  countSchedulesByWeekday,
  weekdays,
  type WeekdayKey,
  type WorkShiftColor,
} from '@/entities/work-schedule';
import { getDashboardWorkSchedule } from '@/entities/work-schedule/api/get-dashboard-work-schedule';
import type { WidgetSize } from '@/shared/dashboard/lib/widget-size';
import { WidgetCard, WidgetCardAction, WidgetCardHeader } from '@/shared/dashboard/ui/widget-card';
import { cn } from '@/shared/lib/utils';

const header = (
  <WidgetCardHeader title="업무 스케줄" action={<WidgetCardAction>스케줄</WidgetCardAction>} />
);

const shiftColorClassName: Record<WorkShiftColor, string> = {
  sky: 'bg-sky-100 text-sky-700',
  violet: 'bg-violet-100 text-violet-700',
  amber: 'bg-amber-100 text-amber-700',
  slate: 'bg-slate-100 text-slate-600',
  emerald: 'bg-emerald-100 text-emerald-700',
  rose: 'bg-rose-100 text-rose-700',
};

const weekdayByDateIndex: WeekdayKey[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

function getTodayWeekday(): WeekdayKey {
  return weekdayByDateIndex[new Date().getDay()];
}

function getNextWeekdays(today: WeekdayKey, count: number) {
  const todayIndex = weekdays.findIndex((weekday) => weekday.key === today);
  return Array.from({ length: count }, (_, index) => {
    const weekdayIndex = (todayIndex + index) % weekdays.length;
    return weekdays[weekdayIndex];
  });
}

function shiftTimeLabel(startTime: string | null, endTime: string | null) {
  if (!startTime || !endTime) return '휴무';
  return `${startTime}-${endTime}`;
}

interface WorkScheduleSummaryProps {
  workspaceId: string;
  size?: WidgetSize;
}

export default function WorkScheduleSummary({
  workspaceId,
  size = 'md',
}: WorkScheduleSummaryProps) {
  const { data, isError, isPending } = useQuery({
    queryKey: ['work-schedule', 'dashboard', workspaceId],
    queryFn: () => getDashboardWorkSchedule(workspaceId),
  });

  if (isError) {
    return (
      <WidgetCard>
        {header}
        <div className="text-brand-muted flex min-h-0 flex-1 items-center justify-center text-center text-sm">
          업무 스케줄을 불러오지 못했습니다.
        </div>
      </WidgetCard>
    );
  }

  if (isPending || !data) {
    return (
      <WidgetCard>
        {header}
        <div className="text-brand-muted flex min-h-0 flex-1 items-center justify-center text-center text-sm">
          업무 스케줄을 불러오는 중입니다.
        </div>
      </WidgetCard>
    );
  }

  const { members, shifts, schedule } = data;
  const today = getTodayWeekday();
  const todayCounts = countSchedulesByWeekday({
    schedule,
    config: { shifts },
    weekday: today,
  });
  const workingShifts = shifts.filter((shift) => !shift.isOff);
  const totalWorkingMembers = workingShifts.reduce(
    (total, shift) => total + (todayCounts[shift.id] ?? 0),
    0,
  );
  const primaryShift = workingShifts.find((shift) => (todayCounts[shift.id] ?? 0) > 0);

  if (members.length === 0) {
    return (
      <WidgetCard>
        {header}
        <div className="text-brand-muted flex min-h-0 flex-1 items-center justify-center text-center text-sm">
          등록된 근무자가 없습니다.
        </div>
      </WidgetCard>
    );
  }

  if (size === 'sm') {
    return (
      <WidgetCard>
        {header}
        <div className="flex items-center gap-3">
          <span className="bg-brand/10 text-brand flex size-10 shrink-0 items-center justify-center rounded-xl">
            <ClipboardList className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-brand-muted text-xs">오늘 근무</p>
            <p className="text-brand-ink mt-0.5 text-lg font-bold">{totalWorkingMembers}명</p>
            {primaryShift && (
              <p className="text-brand-muted truncate text-xs">
                {primaryShift.name} · {shiftTimeLabel(primaryShift.startTime, primaryShift.endTime)}
              </p>
            )}
          </div>
        </div>
      </WidgetCard>
    );
  }

  const visibleShifts = size === 'md' ? workingShifts : shifts;
  const nextDays = getNextWeekdays(today, 4);

  return (
    <WidgetCard>
      {header}
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-brand-muted text-xs">오늘 근무 인원</p>
          <p className="text-brand-ink mt-1 text-2xl font-bold">{totalWorkingMembers}명</p>
        </div>
        <span className="text-brand-muted rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold">
          전체 {members.length}명
        </span>
      </div>

      <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
        {visibleShifts.map((shift) => (
          <li key={shift.id} className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className={cn(
                  'inline-flex shrink-0 rounded-full px-2 py-1 text-xs font-semibold',
                  shiftColorClassName[shift.color],
                )}
              >
                {shift.name}
              </span>
              <span className="text-brand-muted truncate text-xs">
                {shiftTimeLabel(shift.startTime, shift.endTime)}
              </span>
            </div>
            <span className="text-brand-ink text-sm font-bold">{todayCounts[shift.id] ?? 0}명</span>
          </li>
        ))}
      </ul>

      {size === 'lg' && (
        <div className="border-brand/10 mt-4 border-t pt-3">
          <p className="text-brand-muted mb-2 text-xs font-semibold">요일별 근무 요약</p>
          <div className="grid grid-cols-4 gap-2">
            {nextDays.map((weekday) => {
              const counts = countSchedulesByWeekday({
                schedule,
                config: { shifts },
                weekday: weekday.key,
              });
              const workingCount = workingShifts.reduce(
                (total, shift) => total + (counts[shift.id] ?? 0),
                0,
              );

              return (
                <div
                  key={weekday.key}
                  className="bg-brand-surface rounded-xl px-2 py-2 text-center"
                >
                  <p className="text-brand-muted text-[11px]">{weekday.label}</p>
                  <p className="text-brand-ink mt-0.5 text-sm font-bold">{workingCount}명</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </WidgetCard>
  );
}
