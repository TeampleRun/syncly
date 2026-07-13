// 워크스페이스별 근무유형을 정렬 순서대로 조회해 화면용 타입으로 변환하는 서버 조회 함수입니다.
import { cache } from 'react';
import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import type { WorkShiftColor, WorkShiftOption } from '../model/work-schedule.types';

function toTime(value: string | null): string | null {
  return value ? value.slice(0, 5) : null;
}

export const getWorkShiftTypesByWorkspaceId = cache(
  async (workspaceId: string): Promise<WorkShiftOption[]> => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('work_shift_types')
      .select('id, code, name, start_time, end_time, ends_next_day, color, is_off')
      .eq('workspace_id', workspaceId)
      .order('sort_order');

    if (error) {
      throw new Error(`근무 유형 조회에 실패했습니다: ${error.message}`);
    }

    return (data ?? []).map((shift) => ({
      id: shift.id,
      code: shift.code,
      name: shift.name,
      startTime: toTime(shift.start_time),
      endTime: toTime(shift.end_time),
      endsNextDay: shift.ends_next_day,
      color: shift.color as WorkShiftColor,
      isOff: shift.is_off,
    }));
  },
);
