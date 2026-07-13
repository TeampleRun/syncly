// 백로그(스프린트 미편입) 업무 조회 — workspace 범위 + sprint_id is null 필터
// 담당자 표시명은 members에서 해석하므로 profiles 조인은 하지 않고 assignee_id만 가져온다.
import { getSupabaseBrowserClient } from '@/shared/api/supabase/client';
import { toTask } from '../model/task.mapper';
import type { Task } from '../model/task.types';

export async function getBacklogTasks(workspaceId: string): Promise<Task[]> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('workspace_id', workspaceId)
    .is('sprint_id', null)
    .order('sort_order');

  if (error) {
    throw new Error(`백로그 조회에 실패했습니다: ${error.message}`);
  }

  return (data ?? []).map(toTask);
}
