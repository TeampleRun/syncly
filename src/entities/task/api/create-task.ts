'use server';

import { getCurrentUserId } from '@/shared/api/supabase/current-user';
import { createSupabaseServerClient } from '@/shared/api/supabase/server';

import { toTaskInsert } from '../model/task.mapper';
import { taskTitleSchema } from '../model/task.schema';

export async function createTask(params: { workspaceId: string; title: string }): Promise<void> {
  const parsedTitle = taskTitleSchema.safeParse(params.title);

  if (!parsedTitle.success) {
    throw new Error(parsedTitle.error.issues[0]?.message ?? '입력값이 올바르지 않습니다');
  }

  const supabase = await createSupabaseServerClient();
  const currentUserId = await getCurrentUserId();
  const { data: lastTask, error: lastTaskError } = await supabase
    .from('tasks')
    .select('sort_order')
    .eq('workspace_id', params.workspaceId)
    .is('sprint_id', null)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (lastTaskError) {
    throw new Error(`업무 순서 조회에 실패했습니다: ${lastTaskError.message}`);
  }

  const today = new Date();
  const dueDate = today.toISOString().slice(0, 10);
  const payload = toTaskInsert({
    workspaceId: params.workspaceId,
    title: parsedTitle.data,
    assigneeId: currentUserId,
    createdBy: currentUserId,
    dueDate,
    sortOrder: (lastTask?.sort_order ?? -1) + 1,
  });

  const { error } = await supabase.from('tasks').insert(payload);

  if (error) {
    console.error('[task/createTask] insert 실패:', error);
    throw new Error('업무 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }
}
