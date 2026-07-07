// 근무 옵션을 추가, 제거, 정렬하고 시간을 설정할 수 있는 인라인 편집기입니다.
import { ChevronDown, ChevronUp } from 'lucide-react';
import type {
  WorkScheduleConfig,
  WorkShiftColor,
  WorkShiftOption,
} from '@/entities/work-schedule';

const shiftColors: WorkShiftColor[] = ['sky', 'violet', 'amber', 'slate', 'emerald', 'rose'];

interface WorkShiftSettingsPanelProps {
  config: WorkScheduleConfig;
  onAddShift: () => void;
  onDeleteShift: (shiftId: string) => void;
  onMoveShift: (shiftId: string, direction: 'up' | 'down') => void;
  onUpdateShift: (shiftId: string, nextShift: WorkShiftOption) => void;
}

export function WorkShiftSettingsPanel({
  config,
  onAddShift,
  onDeleteShift,
  onMoveShift,
  onUpdateShift,
}: WorkShiftSettingsPanelProps) {
  return (
    <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">근무 유형 설정</h2>
          <p className="mt-1 text-sm text-slate-500">
            매장 운영 방식에 맞게 교대 유형과 근무 시간을 조정합니다.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddShift}
          className="h-9 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          유형 추가
        </button>
      </div>

      <div className="space-y-3">
        {config.shifts.map((shift, index) => (
          <div
            key={shift.id}
            className="grid grid-cols-[260px_170px_170px_140px_90px_190px] items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3"
          >
            <label className="space-y-2 text-xs font-semibold text-slate-500">
              이름
              <input
                value={shift.name}
                onChange={(event) =>
                  onUpdateShift(shift.id, {
                    ...shift,
                    name: event.target.value,
                  })
                }
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 outline-none focus:border-indigo-400"
              />
            </label>

            <label className="space-y-2 text-xs font-semibold text-slate-500">
              시작
              <input
                type="time"
                value={shift.startTime ?? ''}
                disabled={shift.isOff}
                onChange={(event) =>
                  onUpdateShift(shift.id, {
                    ...shift,
                    startTime: event.target.value || null,
                  })
                }
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-indigo-400 disabled:bg-slate-100 disabled:text-slate-400"
              />
            </label>

            <label className="space-y-2 text-xs font-semibold text-slate-500">
              종료
              <input
                type="time"
                value={shift.endTime ?? ''}
                disabled={shift.isOff}
                onChange={(event) =>
                  onUpdateShift(shift.id, {
                    ...shift,
                    endTime: event.target.value || null,
                  })
                }
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-indigo-400 disabled:bg-slate-100 disabled:text-slate-400"
              />
            </label>

            <label className="space-y-2 text-xs font-semibold text-slate-500">
              색상
              <select
                value={shift.color}
                onChange={(event) =>
                  onUpdateShift(shift.id, {
                    ...shift,
                    color: event.target.value as WorkShiftColor,
                  })
                }
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-indigo-400"
              >
                {shiftColors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex items-center gap-2 pt-5 text-sm font-semibold text-slate-600">
              <input
                type="checkbox"
                checked={shift.isOff}
                onChange={(event) =>
                  onUpdateShift(shift.id, {
                    ...shift,
                    isOff: event.target.checked,
                    startTime: event.target.checked ? null : (shift.startTime ?? '09:00'),
                    endTime: event.target.checked ? null : (shift.endTime ?? '18:00'),
                  })
                }
                className="h-4 w-4 accent-indigo-600"
              />
              휴무
            </label>

            <div className="flex justify-end gap-2 pt-5">
              <button
                type="button"
                onClick={() => onMoveShift(shift.id, 'up')}
                disabled={index === 0}
                aria-label={`${shift.name} 위로 이동`}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronUp className="h-4 w-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => onMoveShift(shift.id, 'down')}
                disabled={index === config.shifts.length - 1}
                aria-label={`${shift.name} 아래로 이동`}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => onDeleteShift(shift.id)}
                disabled={config.shifts.length <= 1}
                className="h-8 rounded-lg border border-rose-200 bg-white px-3 text-xs font-semibold text-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}