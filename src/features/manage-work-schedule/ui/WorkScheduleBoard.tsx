'use client';

// 근무표, 근무유형 설정, 삭제 대체 선택 UI를 렌더링하고 서버 액션 저장을 연결하는 핵심 화면입니다.
import { useState } from 'react';
import { toast } from 'sonner';
import {
  countSchedulesByWeekday,
  getWorkMembersByWeekday,
  weekdays,
  type WorkScheduleConfig,
  type WorkScheduleEntry,
} from '@/entities/work-schedule';
import {
  createWorkShiftType,
  reorderWorkShiftTypes,
  replaceAndDeleteWorkShiftType,
  saveWorkScheduleEntry,
  updateWorkShiftType,
} from '@/entities/work-schedule/api/work-schedule-actions';
import type { WorkspaceMember } from '@/entities/workspace-member';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { useWorkScheduleState } from '../model/use-work-schedule-state';
import { WorkScheduleCell } from './WorkScheduleCell';
import { WorkShiftSettingsPanel } from './WorkShiftSettingsPanel';
import { WorkShiftLegend } from './WorkShiftLegend';

interface WorkScheduleBoardProps {
  workspaceId: string;
  members: WorkspaceMember[];
  config: WorkScheduleConfig;
  initialSchedule: WorkScheduleEntry[];
  weekStartDate: string;
}

export function WorkScheduleBoard({
  workspaceId,
  members,
  config,
  initialSchedule,
  weekStartDate,
}: WorkScheduleBoardProps) {
  const [scheduleConfig, setScheduleConfig] = useState(config);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [shiftToDeleteId, setShiftToDeleteId] = useState<string | null>(null);
  const [replacementShiftId, setReplacementShiftId] = useState('');
  const { schedule, cycleCell, replaceShiftOption } = useWorkScheduleState({
    initialSchedule,
    members,
    config: scheduleConfig,
    weekStartDate,
  });

  const handleAddShift = async (): Promise<void> => {
    try {
      const newShift = await createWorkShiftType(workspaceId);
      setScheduleConfig((current) => ({ shifts: [...current.shifts, newShift] }));
    } catch (error) {
      console.error(error);
      toast.error('근무 유형을 추가하지 못했습니다.');
    }
  };

  const handleUpdateShift = (
    shiftId: string,
    nextShift: WorkScheduleConfig['shifts'][number],
  ): void => {
    setScheduleConfig((current) => ({
      shifts: current.shifts.map((shift) => (shift.id === shiftId ? nextShift : shift)),
    }));
  };

  const handleCommitShift = async (shiftId: string): Promise<void> => {
    const shift = scheduleConfig.shifts.find((item) => item.id === shiftId);
    if (!shift) return;

    try {
      await updateWorkShiftType({ workspaceId, ...shift });
    } catch (error) {
      console.error(error);
      toast.error('근무 유형 저장에 실패했습니다. 입력 값을 확인해주세요.');
    }
  };

  const handleDeleteShift = (shiftId: string): void => {
    if (scheduleConfig.shifts.length <= 1) return;
    const replacement = scheduleConfig.shifts.find((shift) => shift.id !== shiftId);
    setReplacementShiftId(replacement?.id ?? '');
    setShiftToDeleteId(shiftId);
  };

  const confirmDeleteShift = async (): Promise<void> => {
    if (!shiftToDeleteId || !replacementShiftId) return;

    try {
      await replaceAndDeleteWorkShiftType({
        workspaceId,
        deletedShiftTypeId: shiftToDeleteId,
        replacementShiftTypeId: replacementShiftId,
      });
      replaceShiftOption(shiftToDeleteId, replacementShiftId);
      setScheduleConfig((current) => ({
        shifts: current.shifts.filter((shift) => shift.id !== shiftToDeleteId),
      }));
      setShiftToDeleteId(null);
    } catch (error) {
      console.error(error);
      toast.error('근무 유형을 삭제하지 못했습니다.');
    }
  };

  const handleMoveShift = async (shiftId: string, direction: 'up' | 'down'): Promise<void> => {
    let nextShiftIds: string[] | null = null;
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
      nextShiftIds = nextShifts.map((shift) => shift.id);

      return {
        shifts: nextShifts,
      };
    });

    if (!nextShiftIds) return;
    try {
      await reorderWorkShiftTypes({ workspaceId, shiftTypeIds: nextShiftIds });
    } catch (error) {
      console.error(error);
      toast.error('근무 유형 순서 저장에 실패했습니다.');
    }
  };

  const handleCycleCell = async (
    userId: string,
    weekday: (typeof weekdays)[number]['key'],
  ): Promise<void> => {
    const nextEntry = cycleCell(userId, weekday);
    if (!nextEntry) return;

    try {
      await saveWorkScheduleEntry({
        workspaceId,
        userId,
        workDate: nextEntry.workDate,
        shiftTypeId: nextEntry.shiftTypeId,
      });
    } catch (error) {
      console.error(error);
      toast.error('근무 스케줄 저장에 실패했습니다.');
    }
  };

  const shiftToDelete = scheduleConfig.shifts.find((shift) => shift.id === shiftToDeleteId);

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
          onCommitShift={handleCommitShift}
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
                const shift = scheduleConfig.shifts.find((item) => item.id === entry?.shiftTypeId);

                if (!entry || !shift) return null;

                return (
                  <WorkScheduleCell
                    key={`${member.userId}-${weekday.key}`}
                    shift={shift}
                    onCycle={() => void handleCycleCell(member.userId, weekday.key)}
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

      <Dialog
        open={Boolean(shiftToDelete)}
        onOpenChange={(open) => !open && setShiftToDeleteId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{shiftToDelete?.name} 근무 유형을 삭제할까요?</DialogTitle>
            <DialogDescription>
              이 유형이 배정된 일정은 아래에서 선택한 대체 근무 유형으로 일괄 변경됩니다.
            </DialogDescription>
          </DialogHeader>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            대체 근무 유형
            <select
              value={replacementShiftId}
              onChange={(event) => setReplacementShiftId(event.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3"
            >
              {scheduleConfig.shifts
                .filter((shift) => shift.id !== shiftToDeleteId)
                .map((shift) => (
                  <option key={shift.id} value={shift.id}>
                    {shift.name}
                  </option>
                ))}
            </select>
          </label>
          <DialogFooter>
            <button
              type="button"
              onClick={() => setShiftToDeleteId(null)}
              className="h-9 rounded-lg border border-slate-200 px-3 font-semibold"
            >
              취소
            </button>
            <button
              type="button"
              onClick={() => void confirmDeleteShift()}
              className="h-9 rounded-lg bg-rose-600 px-3 font-semibold text-white"
            >
              대체 후 삭제
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
