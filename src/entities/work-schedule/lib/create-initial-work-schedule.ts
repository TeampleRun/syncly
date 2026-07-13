// DB 데이터가 없는 목업 화면에서 멤버별 월요일부터 일요일까지 기본 근무 일정을 생성합니다.
import type { WorkspaceMember } from '@/entities/workspace-member';
import { getDefaultWorkShiftOption } from './get-default-work-shift-option';
import { weekdays } from '../model/weekdays';
import type { WorkScheduleConfig, WorkScheduleEntry } from '../model/work-schedule.types';

interface CreateInitialWorkScheduleParams {
  workspaceId: string;
  members: WorkspaceMember[];
  config: WorkScheduleConfig;
}

export function createInitialWorkSchedule({
  workspaceId,
  members,
  config,
}: CreateInitialWorkScheduleParams): WorkScheduleEntry[] {
  const defaultShift = getDefaultWorkShiftOption(config.shifts);
  const today = new Date();
  const mondayOffset = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - mondayOffset);

  const toDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return members.flatMap((member) =>
    weekdays.map((weekday, index) => {
      const workDate = new Date(monday);
      workDate.setDate(monday.getDate() + index);

      return {
        workspaceId,
        userId: member.userId,
        weekday: weekday.key,
        workDate: toDateString(workDate),
        shiftTypeId: defaultShift.id,
      };
    }),
  );
}
