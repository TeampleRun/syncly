// 설정된 배열 순서에 따라 다음 근무 옵션을 반환합니다.
import type { WorkShiftOption } from '../model/work-schedule.types';

interface GetNextWorkShiftOptionParams {
  shifts: WorkShiftOption[];
  currentShiftOptionId: string;
}

export function getNextWorkShiftOption({
  shifts,
  currentShiftOptionId,
}: GetNextWorkShiftOptionParams): WorkShiftOption {
  const currentIndex = shifts.findIndex((shift) => shift.id === currentShiftOptionId);
  const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % shifts.length;

  return shifts[nextIndex];
}
