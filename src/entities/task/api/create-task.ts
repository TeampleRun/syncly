'use server';

import { getCurrentUserId } from '@/shared/api/supabase/current-user';
import { createSupabaseServerClient } from '@/shared/api/supabase/server';

import { taskTitleSchema } from '../model/task.schema';

type UntypedRpcClient = {
  rpc: (
    fn: string,
    args?: Record<string, unknown>,
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export async function createTask(params: { workspaceId: string; title: string }): Promise<void> {
  const parsedTitle = taskTitleSchema.safeParse(params.title);

  if (!parsedTitle.success) {
    throw new Error(parsedTitle.error.issues[0]?.message ?? '입력값이 올바르지 않습니다');
  }

  const supabase = await createSupabaseServerClient();
  const currentUserId = await getCurrentUserId();
  const today = new Date();
  const dueDate = today.toISOString().slice(0, 10);

  const { error } = await (supabase as unknown as UntypedRpcClient).rpc('create_task', {
    p_workspace_id: params.workspaceId,
    p_title: parsedTitle.data,
    p_user_id: currentUserId,
    p_due_date: dueDate,
  });

  if (error) {
    console.error('[task/createTask] RPC 실패:', error);
    throw new Error('업무 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }
}
