// 모든 워크스페이스 멤버에 대한 기본 요일별 근무 일정을 생성합니다.
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

  return members.flatMap((member) =>
    weekdays.map((weekday) => ({
      workspaceId,
      userId: member.userId,
      weekday: weekday.key,
      shiftOptionId: defaultShift.id,
    })),
  );
}
