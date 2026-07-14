import { getSupabaseBrowserClient } from '@/shared/api/supabase/client';

import { toTask, type TaskQueryRow } from '../model/task.mapper';
import type { Task } from '../model/task.types';

export async function getTasksByWorkspaceId(workspaceId: string): Promise<Task[]> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from('tasks')
    .select(
      'id, workspace_id, title, assignee_id, due_date, status, sort_order, assignee_profile:profiles!tasks_assignee_id_fkey(real_name)',
    )
    .eq('workspace_id', workspaceId)
    .is('sprint_id', null)
    .order('sort_order');

  if (error) {
    throw new Error(`업무 조회에 실패했습니다: ${error.message}`);
  }

  return ((data ?? []) as TaskQueryRow[]).map(toTask);
}
