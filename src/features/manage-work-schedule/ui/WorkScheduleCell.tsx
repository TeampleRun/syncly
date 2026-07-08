// 클릭하면 설정된 근무 옵션을 순서대로 전환하는 일정표 셀입니다.
import type { WorkShiftOption } from '@/entities/work-schedule';
import { WorkShiftBadge } from './WorkShiftBadge';

interface WorkScheduleCellProps {
  shift: WorkShiftOption;
  onCycle: () => void;
}

export function WorkScheduleCell({ shift, onCycle }: WorkScheduleCellProps) {
  return (
    <button
      type="button"
      onClick={onCycle}
      className="flex h-20 w-full items-center justify-center rounded-md transition hover:bg-slate-50"
      aria-label="근무 유형 변경"
    >
      <WorkShiftBadge shift={shift} />
    </button>
  );
}
