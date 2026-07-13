// 특정 스프린트에 편입된 업무 조회 — tasks 단순 필터(집계 아님 → 직접 쿼리)
// 담당자 표시명은 members에서 해석하므로 profiles 조인은 하지 않고 assignee_id만 가져온다.
import { getSupabaseBrowserClient } from '@/shared/api/supabase/client';
import { toTask } from '../model/task.mapper';
import type { Task } from '../model/task.types';

export async function getSprintTasks(sprintId: string): Promise<Task[]> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('sprint_id', sprintId)
    .order('sort_order');

  if (error) {
    throw new Error(`스프린트 업무 조회에 실패했습니다: ${error.message}`);
  }

  return (data ?? []).map(toTask);
}
