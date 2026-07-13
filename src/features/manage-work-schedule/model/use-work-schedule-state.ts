'use client';

// 서버에서 받은 일정의 화면 상태를 관리하고, 셀 클릭 시 다음 근무유형으로 낙관적으로 변경합니다.
import { useState } from 'react';
import {
  getDefaultWorkShiftOption,
  getNextWorkShiftOption,
  getWorkDateByWeekday,
  weekdays,
  type WeekdayKey,
  type WorkScheduleConfig,
  type WorkScheduleEntry,
} from '@/entities/work-schedule';
import type { WorkspaceMember } from '@/entities/workspace-member';

interface UseWorkScheduleStateParams {
  initialSchedule: WorkScheduleEntry[];
  members: WorkspaceMember[];
  config: WorkScheduleConfig;
  weekStartDate: string;
}

function completeScheduleEntries({
  initialSchedule,
  members,
  config,
  weekStartDate,
}: UseWorkScheduleStateParams): WorkScheduleEntry[] {
  const defaultShift = getDefaultWorkShiftOption(config.shifts);
  const existingEntries = new Set(
    initialSchedule.map((entry) => `${entry.userId}:${entry.weekday}`),
  );

  return [
    ...initialSchedule,
    ...members.flatMap((member) =>
      weekdays.flatMap((weekday) => {
        if (existingEntries.has(`${member.userId}:${weekday.key}`) || !defaultShift) return [];

        return {
          workspaceId: member.workspaceId,
          userId: member.userId,
          weekday: weekday.key,
          workDate: getWorkDateByWeekday(weekStartDate, weekday.key),
          shiftTypeId: defaultShift.id,
        };
      }),
    ),
  ];
}

export function useWorkScheduleState(params: UseWorkScheduleStateParams) {
  const { config } = params;
  const [schedule, setSchedule] = useState(() => completeScheduleEntries(params));

  const cycleCell = (userId: string, weekday: WeekdayKey): WorkScheduleEntry | null => {
    const currentEntry = schedule.find(
      (entry) => entry.userId === userId && entry.weekday === weekday,
    );
    if (!currentEntry) return null;

    const nextShift = getNextWorkShiftOption({
      shifts: config.shifts,
      currentShiftTypeId: currentEntry.shiftTypeId,
    });
    const nextEntry = { ...currentEntry, shiftTypeId: nextShift.id };

    setSchedule((current) => {
      return current.map((entry) => {
        if (entry.userId !== userId || entry.weekday !== weekday) {
          return entry;
        }
        return nextEntry;
      });
    });

    return nextEntry;
  };

  const replaceShiftOption = (fromShiftTypeId: string, toShiftTypeId: string): void => {
    setSchedule((current) => {
      return current.map((entry) =>
        entry.shiftTypeId === fromShiftTypeId ? { ...entry, shiftTypeId: toShiftTypeId } : entry,
      );
    });
  };

  return {
    schedule,
    cycleCell,
    replaceShiftOption,
  };
}
