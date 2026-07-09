'use client';

// 워크스페이스의 목업 매장 근무 일정 화면을 구성합니다.
import { createInitialWorkSchedule, mockWorkScheduleConfig } from '@/entities/work-schedule';
import { getMockWorkspaceMembersByWorkspaceId } from '@/entities/workspace-member';
import { WorkScheduleBoard } from '@/features/manage-work-schedule';

interface WorkScheduleViewProps {
  workspaceId: string;
}

export function WorkScheduleView({ workspaceId }: WorkScheduleViewProps) {
  const members = getMockWorkspaceMembersByWorkspaceId(workspaceId);
  const initialSchedule = createInitialWorkSchedule({
    workspaceId,
    members,
    config: mockWorkScheduleConfig,
  });

  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-950">업무 스케줄</h1>
        <p className="mt-1 text-sm text-slate-500">셀을 클릭하면 근무 유형이 변경됩니다</p>
      </div>

      <WorkScheduleBoard
        members={members}
        config={mockWorkScheduleConfig}
        initialSchedule={initialSchedule}
      />
    </section>
  );
}
