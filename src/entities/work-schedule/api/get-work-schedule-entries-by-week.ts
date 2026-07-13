// 워크스페이스의 지정된 한 주 스케줄을 조회하고, DB 날짜를 월~일 UI 키로 변환하는 서버 조회 함수입니다.
import { cache } from 'react';
import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import { getWeekdayFromWorkDate } from '../lib/work-date';
import type { WorkScheduleEntry } from '../model/work-schedule.types';

export const getWorkScheduleEntriesByWeek = cache(
  async (workspaceId: string, startDate: string, endDate: string): Promise<WorkScheduleEntry[]> => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('work_schedule_entries')
      .select('workspace_id, user_id, work_date, shift_type_id')
      .eq('workspace_id', workspaceId)
      .gte('work_date', startDate)
      .lte('work_date', endDate);

    if (error) {
      throw new Error(`근무 스케줄 조회에 실패했습니다: ${error.message}`);
    }

    return (data ?? []).map((entry) => ({
      workspaceId: entry.workspace_id,
      userId: entry.user_id,
      workDate: entry.work_date,
      weekday: getWeekdayFromWorkDate(entry.work_date),
      shiftTypeId: entry.shift_type_id,
    }));
  },
);
