// 현재 주의 멤버, 근무유형, 스케줄 데이터를 병렬 조회해 근무 스케줄 화면에 전달하는 서버 페이지입니다.
import { getWorkspaceMembersByWorkspaceId } from '@/entities/workspace-member/api/get-workspace-members-by-id';
import { getWorkScheduleEntriesByWeek } from '@/entities/work-schedule/api/get-work-schedule-entries-by-week';
import { getWorkShiftTypesByWorkspaceId } from '@/entities/work-schedule/api/get-work-shift-types-by-workspace-id';
import { ensureWeeklyWorkScheduleEntries } from '@/entities/work-schedule/api/ensure-weekly-work-schedule-entries';
import { getCurrentWeekRange } from '@/entities/work-schedule';
import { WorkScheduleView } from '@/views/store-operation/work-schedule';

interface WorkSchedulePageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

export default async function WorkSchedulePage({ params }: WorkSchedulePageProps) {
  const { workspaceId } = await params;
  const { startDate, endDate } = getCurrentWeekRange();
  await ensureWeeklyWorkScheduleEntries(workspaceId, startDate);
  const [members, shifts, schedule] = await Promise.all([
    getWorkspaceMembersByWorkspaceId(workspaceId),
    getWorkShiftTypesByWorkspaceId(workspaceId),
    getWorkScheduleEntriesByWeek(workspaceId, startDate, endDate),
  ]);

  return (
    <WorkScheduleView
      workspaceId={workspaceId}
      members={members}
      shifts={shifts}
      schedule={schedule}
      weekStartDate={startDate}
    />
  );
}
