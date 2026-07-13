'use client';

// 서버에서 조회한 매장 운영 워크스페이스의 근무유형과 일정을 화면 구성 요소에 전달합니다.
import type { WorkScheduleEntry, WorkShiftOption } from '@/entities/work-schedule';
import type { WorkspaceMember } from '@/entities/workspace-member';
import { WorkScheduleBoard } from '@/features/manage-work-schedule';

interface WorkScheduleViewProps {
  workspaceId: string;
  members: WorkspaceMember[];
  shifts: WorkShiftOption[];
  schedule: WorkScheduleEntry[];
  weekStartDate: string;
}

export function WorkScheduleView({
  workspaceId,
  members,
  shifts,
  schedule,
  weekStartDate,
}: WorkScheduleViewProps) {
  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-950">업무 스케줄</h1>
        <p className="mt-1 text-sm text-slate-500">셀을 클릭하면 근무 유형이 변경됩니다</p>
      </div>

      <WorkScheduleBoard
        members={members}
        workspaceId={workspaceId}
        config={{ shifts }}
        initialSchedule={schedule}
        weekStartDate={weekStartDate}
      />
    </section>
  );
}
