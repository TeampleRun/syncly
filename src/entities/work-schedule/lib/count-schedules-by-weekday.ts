// 특정 요일에 근무유형별로 몇 명이 배정됐는지 화면 하단 합계용으로 계산합니다.
import type { WeekdayKey } from '../model/weekdays';
import type { WorkScheduleConfig, WorkScheduleEntry } from '../model/work-schedule.types';

interface CountSchedulesByWeekdayParams {
  schedule: WorkScheduleEntry[];
  config: WorkScheduleConfig;
  weekday: WeekdayKey;
}

export function countSchedulesByWeekday({
  schedule,
  config,
  weekday,
}: CountSchedulesByWeekdayParams): Record<string, number> {
  const counts = Object.fromEntries(config.shifts.map((shift) => [shift.id, 0]));

  const uniqueEntries = new Map<string, WorkScheduleEntry>();

  schedule
    .filter((entry) => entry.weekday === weekday)
    .forEach((entry) => {
      uniqueEntries.set(`${entry.userId}-${entry.weekday}`, entry);
    });

  uniqueEntries.forEach((entry) => {
    counts[entry.shiftTypeId] = (counts[entry.shiftTypeId] ?? 0) + 1;
  });

  return counts;
}
