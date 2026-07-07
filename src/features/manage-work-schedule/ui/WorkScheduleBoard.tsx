'use client';

// 수정 가능한 요일별 근무 일정표, 근무 설정, 요일별 요약을 렌더링합니다.
import { useState } from 'react';
import {
  countSchedulesByWeekday,
  getWorkMembersByWeekday,
  weekdays,
  type WorkScheduleConfig,
  type WorkScheduleEntry,
} from '@/entities/work-schedule';
import type { WorkspaceMember } from '@/entities/workspace-member';
import { useWorkScheduleState } from '../model/use-work-schedule-state';
import { WorkScheduleCell } from './WorkScheduleCell';
import { WorkShiftSettingsPanel } from './WorkShiftSettingsPanel';
import { WorkShiftLegend } from './WorkShiftLegend';

interface WorkScheduleBoardProps {
  members: WorkspaceMember[];
  config: WorkScheduleConfig;
  initialSchedule: WorkScheduleEntry[];
}

export function WorkScheduleBoard({ members, config, initialSchedule }: WorkScheduleBoardProps) {
  const [scheduleConfig, setScheduleConfig] = useState(config);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { schedule, cycleCell, replaceShiftOption } = useWorkScheduleState({
    initialSchedule,
    members,
    config: scheduleConfig,
  });

  const handleAddShift = (): void => {
    setScheduleConfig((current) => ({
      shifts: [
        ...current.shifts,
        {
          id: `shift-${crypto.randomUUID()}`,
          name: '새 근무',
          startTime: '09:00',
          endTime: '18:00',
          color: 'emerald',
          isOff: false,
        },
      ],
    }));
  };

  const handleUpdateShift = (
    shiftId: string,
    nextShift: WorkScheduleConfig['shifts'][number],
  ): void => {
    setScheduleConfig((current) => ({
      shifts: current.shifts.map((shift) => (shift.id === shiftId ? nextShift : shift)),
    }));
  };

  const handleDeleteShift = (shiftId: string): void => {
    if (scheduleConfig.shifts.length <= 1) return;

    const nextShifts = scheduleConfig.shifts.filter((shift) => shift.id !== shiftId);
    const fallbackShift = nextShifts.find((shift) => !shift.isOff) ?? nextShifts[0];

    replaceShiftOption(shiftId, fallbackShift.id);
    setScheduleConfig({ shifts: nextShifts });
  };

  const handleMoveShift = (shiftId: string, direction: 'up' | 'down'): void => {
    setScheduleConfig((current) => {
      const currentIndex = current.shifts.findIndex((shift) => shift.id === shiftId);
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

      if (currentIndex === -1 || targetIndex < 0 || targetIndex >= current.shifts.length) {
        return current;
      }

      const nextShifts = [...current.shifts];
      const currentShift = nextShifts[currentIndex];
      nextShifts[currentIndex] = nextShifts[targetIndex];
      nextShifts[targetIndex] = currentShift;

      return {
        shifts: nextShifts,
      };
    });
  };

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <WorkShiftLegend config={scheduleConfig} />
        <button
          type="button"
          onClick={() => setIsSettingsOpen((current) => !current)}
          className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          근무 유형 설정
        </button>
      </div>

      {isSettingsOpen ? (
        <WorkShiftSettingsPanel
          config={scheduleConfig}
          onAddShift={handleAddShift}
          onDeleteShift={handleDeleteShift}
          onMoveShift={handleMoveShift}
          onUpdateShift={handleUpdateShift}
        />
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-[150px_repeat(7,minmax(96px,1fr))] border-b border-slate-200 bg-white text-sm font-semibold text-slate-500">
            <div className="px-5 py-4">직원</div>
            {weekdays.map((weekday) => (
              <div key={weekday.key} className="px-5 py-4 text-center">
                {weekday.label}
              </div>
            ))}
          </div>

          {members.map((member) => (
            <div
              key={member.userId}
              className="grid grid-cols-[150px_repeat(7,minmax(96px,1fr))] border-b border-slate-100"
            >
              <div className="flex min-w-0 items-center gap-3 px-5 py-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-400 text-sm font-bold text-white">
                  {member.avatarLabel}
                </span>
                <span className="font-semibold break-keep whitespace-nowrap text-slate-900">
                  {member.workspaceNickname}
                </span>
              </div>

              {weekdays.map((weekday) => {
                const entry = schedule.find(
                  (item) => item.userId === member.userId && item.weekday === weekday.key,
                );
                const shift = scheduleConfig.shifts.find(
                  (item) => item.id === entry?.shiftOptionId,
                );

                if (!entry || !shift) return null;

                return (
                  <WorkScheduleCell
                    key={`${member.userId}-${weekday.key}`}
                    shift={shift}
                    onCycle={() => cycleCell(member.userId, weekday.key)}
                  />
                );
              })}
            </div>
          ))}

          <div className="grid grid-cols-[150px_repeat(7,minmax(96px,1fr))] bg-slate-50 text-xs font-semibold">
            <div className="px-5 py-3 text-slate-500">합계</div>
            {weekdays.map((weekday) => {
              const counts = countSchedulesByWeekday({
                schedule,
                config: scheduleConfig,
                weekday: weekday.key,
              });

              return (
                <div key={weekday.key} className="space-y-1 px-5 py-3 text-center">
                  {scheduleConfig.shifts.map((shift) => (
                    <p key={shift.id}>
                      {shift.name} {counts[shift.id] ?? 0}
                    </p>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {weekdays.map((weekday) => {
          const workMembers = getWorkMembersByWeekday({
            schedule,
            members,
            config: scheduleConfig,
            weekday: weekday.key,
          });

          return (
            <article key={weekday.key} className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-sm font-bold text-slate-700">{weekday.label} 근무자</h2>
              <div className="mt-3 flex gap-2">
                {workMembers.map((member) => (
                  <span
                    key={member.userId}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white"
                  >
                    {member.avatarLabel}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-sm text-slate-500">{workMembers.length}명 근무</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
