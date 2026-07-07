// 활성화된 근무 옵션과 설정된 시간을 표시합니다.
import type { WorkScheduleConfig } from '@/entities/work-schedule';
import { WorkShiftBadge } from './WorkShiftBadge';

interface WorkShiftLegendProps {
  config: WorkScheduleConfig;
}

export function WorkShiftLegend({ config }: WorkShiftLegendProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
      {config.shifts.map((shift) => (
        <div key={shift.id} className="flex items-center gap-2">
          <WorkShiftBadge shift={shift} />
          {shift.startTime && shift.endTime ? (
            <span>
              {shift.startTime}-{shift.endTime}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}
