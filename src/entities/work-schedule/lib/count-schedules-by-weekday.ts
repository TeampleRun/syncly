// 특정 요일의 각 근무 옵션에 몇 명의 멤버가 배정되어 있는지 계산합니다.
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
    counts[entry.shiftOptionId] = (counts[entry.shiftOptionId] ?? 0) + 1;
  });

  return counts;
}
