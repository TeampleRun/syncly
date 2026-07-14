// 이번 주에 아직 배정되지 않은 멤버·요일 조합을 기본 근무유형으로만 생성해 화면과 DB 기준을 맞춥니다.
import { getCurrentUserId } from '@/shared/api/supabase/current-user';
import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import { getDefaultWorkShiftOption } from '../lib/get-default-work-shift-option';
import { getWorkDateByWeekday } from '../lib/work-date';
import { weekdays } from '../model/weekdays';
import { getWorkShiftTypesByWorkspaceId } from './get-work-shift-types-by-workspace-id';
import { getWorkspaceMembersByWorkspaceId } from '@/entities/workspace-member/api/get-workspace-members-by-id';
import type { WorkShiftOption } from '../model/work-schedule.types';

export async function ensureWeeklyWorkScheduleEntries(
  workspaceId: string,
  weekStartDate: string,
): Promise<WorkShiftOption | null> {
  const [members, shifts] = await Promise.all([
    getWorkspaceMembersByWorkspaceId(workspaceId),
    getWorkShiftTypesByWorkspaceId(workspaceId),
  ]);
  const defaultShift = getDefaultWorkShiftOption(shifts);

  if (!defaultShift || members.length === 0) return defaultShift ?? null;

  const supabase = await createSupabaseServerClient();
  const createdBy = await getCurrentUserId();
  // 현재 멤버와 이번 주의 모든 조합을 멱등적으로 넣어 탈퇴 멤버의 기존 행 때문에 누락을 놓치지 않는다.
  const entries = members.flatMap((member) =>
    weekdays.map((weekday) => ({
      workspace_id: workspaceId,
      user_id: member.userId,
      work_date: getWorkDateByWeekday(weekStartDate, weekday.key),
      shift_type_id: defaultShift.id,
      created_by: createdBy,
    })),
  );

  const { error } = await supabase.from('work_schedule_entries').upsert(entries, {
    onConflict: 'workspace_id,user_id,work_date',
    ignoreDuplicates: true,
  });

  if (error) throw new Error(`기본 근무 스케줄 생성에 실패했습니다: ${error.message}`);

  return defaultShift;
}
