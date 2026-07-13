// 셀을 클릭했을 때 현재 근무유형 다음에 배치된 유형을 순환하여 반환합니다.
import type { WorkShiftOption } from '../model/work-schedule.types';

interface GetNextWorkShiftOptionParams {
  shifts: WorkShiftOption[];
  currentShiftTypeId: string;
}

export function getNextWorkShiftOption({
  shifts,
  currentShiftTypeId,
}: GetNextWorkShiftOptionParams): WorkShiftOption {
  const currentIndex = shifts.findIndex((shift) => shift.id === currentShiftTypeId);
  const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % shifts.length;

  return shifts[nextIndex];
}
