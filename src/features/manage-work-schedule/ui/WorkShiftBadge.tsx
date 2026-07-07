// 설정된 근무 옵션 하나를 시각적으로 보여주는 배지입니다.
import type { WorkShiftOption } from '@/entities/work-schedule';

const colorClassName: Record<WorkShiftOption['color'], string> = {
  sky: 'bg-sky-100 text-sky-700',
  violet: 'bg-violet-100 text-violet-700',
  amber: 'bg-amber-100 text-amber-700',
  slate: 'bg-slate-100 text-slate-400',
  emerald: 'bg-emerald-100 text-emerald-700',
  rose: 'bg-rose-100 text-rose-700',
};

interface WorkShiftBadgeProps {
  shift: WorkShiftOption;
}

export function WorkShiftBadge({ shift }: WorkShiftBadgeProps) {
  return (
    <span
      className={`inline-flex h-12 min-w-16 flex-col items-center justify-center rounded-2xl px-3 text-xs font-semibold ${colorClassName[shift.color]}`}
    >
      <span>{shift.name}</span>
      {shift.startTime ? <span className="mt-0.5 text-[11px]">{shift.startTime}</span> : null}
    </span>
  );
}
