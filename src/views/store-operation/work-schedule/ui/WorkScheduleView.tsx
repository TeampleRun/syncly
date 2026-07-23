'use client';

// 서버에서 조회한 매장 운영 워크스페이스의 근무유형과 일정을 화면 구성 요소에 전달합니다.
// members는 RSC 값(initialMembers)으로 첫 렌더를 채우고 공유 캐시가 소유한다(닉네임 변경 즉시 반영).
import type { WorkScheduleEntry, WorkShiftOption } from '@/entities/work-schedule';
import {
  useWorkspaceMembersByWorkspaceId,
  type WorkspaceMember,
} from '@/entities/workspace-member';
import { WorkScheduleBoard } from '@/features/manage-work-schedule';

interface WorkScheduleViewProps {
  workspaceId: string;
  initialMembers: WorkspaceMember[];
  shifts: WorkShiftOption[];
  schedule: WorkScheduleEntry[];
  weekStartDate: string;
}

export function WorkScheduleView({
  workspaceId,
  initialMembers,
  shifts,
  schedule,
  weekStartDate,
}: WorkScheduleViewProps) {
  const { data: members = initialMembers } = useWorkspaceMembersByWorkspaceId(
    workspaceId,
    initialMembers,
  );

  return (
    <section className="workspace-page">
      <div className="workspace-page-header">
        <h1 className="workspace-page-title">업무 스케줄</h1>
        <p className="workspace-page-description">셀을 클릭하면 근무 유형이 변경됩니다</p>
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
