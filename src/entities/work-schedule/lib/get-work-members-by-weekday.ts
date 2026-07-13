// 휴무 유형을 제외하고 특정 요일에 실제 근무하는 멤버만 추려 요일별 근무자 목록에 사용합니다.
import type { WorkspaceMember } from '@/entities/workspace-member';
import type { WeekdayKey } from '../model/weekdays';
import type { WorkScheduleConfig, WorkScheduleEntry } from '../model/work-schedule.types';

interface GetWorkMembersByWeekdayParams {
  schedule: WorkScheduleEntry[];
  members: WorkspaceMember[];
  config: WorkScheduleConfig;
  weekday: WeekdayKey;
}

export function getWorkMembersByWeekday({
  schedule,
  members,
  config,
  weekday,
}: GetWorkMembersByWeekdayParams): WorkspaceMember[] {
  const offShiftIds = new Set(
    config.shifts.filter((shift) => shift.isOff).map((shift) => shift.id),
  );

  const workingUserIds = new Set(
    schedule
      .filter((entry) => entry.weekday === weekday && !offShiftIds.has(entry.shiftTypeId))
      .map((entry) => entry.userId),
  );

  return members.filter((member) => workingUserIds.has(member.userId));
}
