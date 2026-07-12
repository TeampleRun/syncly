// 백로그(스프린트 미편입) 업무 조회 — workspace 범위 + sprint_id is null 필터 + 담당자 조인
// profiles FK가 2개(assignee_id/created_by)라 조인 모호성 회피 위해 FK명(tasks_assignee_id_fkey)을 명시한다.
import { getSupabaseBrowserClient } from '@/shared/api/supabase/client';
import { toTask } from '../model/task.mapper';
import type { Task } from '../model/task.types';

const TASK_SELECT = '*, assignee:profiles!tasks_assignee_id_fkey(real_name)';

export async function getBacklogTasks(workspaceId: string): Promise<Task[]> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from('tasks')
    .select(TASK_SELECT)
    .eq('workspace_id', workspaceId)
    .is('sprint_id', null)
    .order('sort_order');

  if (error) {
    throw new Error(`백로그 조회에 실패했습니다: ${error.message}`);
  }

  return (data ?? []).map(toTask);
}
