// 기본 셀 값으로 첫 번째 근무 중인 근무 옵션을 선택합니다.
import type { WorkShiftOption } from '../model/work-schedule.types';

export function getDefaultWorkShiftOption(shifts: WorkShiftOption[]): WorkShiftOption {
  const firstWorkingShift = shifts.find((shift) => !shift.isOff);

  return firstWorkingShift ?? shifts[0];
}
