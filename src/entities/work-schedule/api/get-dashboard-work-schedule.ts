'use server';

// 대시보드 근무 스케줄 위젯이 현재 주의 멤버, 근무유형, 일정 데이터를 한 번에 조회하는 서버 액션입니다.
import { getWorkspaceMembersByWorkspaceId } from '@/entities/workspace-member/api/get-workspace-members-by-id';
import { getCurrentWeekRange } from '../lib/work-date';
import { getWorkScheduleEntriesByWeek } from './get-work-schedule-entries-by-week';
import { getWorkShiftTypesByWorkspaceId } from './get-work-shift-types-by-workspace-id';
import { ensureWeeklyWorkScheduleEntries } from './ensure-weekly-work-schedule-entries';

export async function getDashboardWorkSchedule(workspaceId: string) {
  const { startDate, endDate } = getCurrentWeekRange();
  await ensureWeeklyWorkScheduleEntries(workspaceId, startDate);
  const [members, shifts, schedule] = await Promise.all([
    getWorkspaceMembersByWorkspaceId(workspaceId),
    getWorkShiftTypesByWorkspaceId(workspaceId),
    getWorkScheduleEntriesByWeek(workspaceId, startDate, endDate),
  ]);

  return { members, shifts, schedule };
}
