// DB 컬럼을 화면에서 다루기 쉬운 camelCase 형태로 표현하는 근무유형과 일정 타입입니다.
import type { WeekdayKey } from './weekdays';

export type WorkShiftColor = 'sky' | 'violet' | 'amber' | 'slate' | 'emerald' | 'rose';

export interface WorkShiftOption {
  id: string;
  code: string;
  name: string;
  startTime: string | null;
  endTime: string | null;
  endsNextDay: boolean;
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
  workDate: string;
  shiftTypeId: string;
}
