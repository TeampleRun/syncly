'use client';

// 목업 UI에서 일정 셀의 로컬 상태와 근무 옵션 교체 동작을 관리합니다.
import { useState } from 'react';
import {
  getDefaultWorkShiftOption,
  getNextWorkShiftOption,
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
}

function completeScheduleEntries({
  schedule,
  members,
  config,
}: {
  schedule: WorkScheduleEntry[];
  members: WorkspaceMember[];
  config: WorkScheduleConfig;
}): WorkScheduleEntry[] {
  const defaultShift = getDefaultWorkShiftOption(config.shifts);
  const existingEntryIds = new Set(
    schedule.map((entry) => `${entry.workspaceId}:${entry.userId}:${entry.weekday}`),
  );

  const missingEntries = members.flatMap((member) =>
    weekdays.flatMap((weekday) => {
      const entryId = `${member.workspaceId}:${member.userId}:${weekday.key}`;

      if (existingEntryIds.has(entryId)) {
        return [];
      }

      return {
        workspaceId: member.workspaceId,
        userId: member.userId,
        weekday: weekday.key,
        shiftOptionId: defaultShift.id,
      };
    }),
  );

  if (missingEntries.length === 0) {
    return schedule;
  }

  return [...schedule, ...missingEntries];
}

export function useWorkScheduleState({
  initialSchedule,
  members,
  config,
}: UseWorkScheduleStateParams) {
  const [schedule, setSchedule] = useState(() =>
    completeScheduleEntries({
      schedule: initialSchedule,
      members,
      config,
    }),
  );

  const cycleCell = (userId: string, weekday: WeekdayKey): void => {
    setSchedule((current) => {
      const completedSchedule = completeScheduleEntries({
        schedule: current,
        members,
        config,
      });

      return completedSchedule.map((entry) => {
        if (entry.userId !== userId || entry.weekday !== weekday) {
          return entry;
        }

        const nextShift = getNextWorkShiftOption({
          shifts: config.shifts,
          currentShiftOptionId: entry.shiftOptionId,
        });

        return {
          ...entry,
          shiftOptionId: nextShift.id,
        };
      });
    });
  };

  const replaceShiftOption = (fromShiftOptionId: string, toShiftOptionId: string): void => {
    setSchedule((current) => {
      const completedSchedule = completeScheduleEntries({
        schedule: current,
        members,
        config,
      });

      return completedSchedule.map((entry) =>
        entry.shiftOptionId === fromShiftOptionId
          ? { ...entry, shiftOptionId: toShiftOptionId }
          : entry,
      );
    });
  };

  const completedSchedule = completeScheduleEntries({
    schedule,
    members,
    config,
  });

  return {
    schedule: completedSchedule,
    cycleCell,
    replaceShiftOption,
  };
}
