// 목업 근무 일정 모듈의 설정과 항목에 대한 핵심 타입입니다.
import type { WeekdayKey } from './weekdays';

export type WorkShiftColor = 'sky' | 'violet' | 'amber' | 'slate' | 'emerald' | 'rose';

export interface WorkShiftOption {
  id: string;
  name: string;
  startTime: string | null;
  endTime: string | null;
  color: WorkShiftColor;
  isOff: boolean;
}

export interface WorkScheduleConfig {
  shifts: WorkShiftOption[];
}

export interface WorkScheduleEntry {
  workspaceId: string;
  userId: string;
  weekday: WeekdayKey;
  shiftOptionId: string;
}
