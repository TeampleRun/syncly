'use server';

import { createSupabaseServerClient } from '@/shared/api/supabase/server';

import type { TaskStatus } from '../model/task.types';
import { updateTaskBoardSchema } from '../model/task.schema';
import type { UntypedRpcClient } from './rpc-client';

export async function updateTaskBoard(params: {
  workspaceId: string;
  tasks: Array<{
    id: string;
    status: TaskStatus;
    sortOrder: number;
  }>;
}): Promise<void> {
  const parsed = updateTaskBoardSchema.safeParse(params);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? '입력값이 올바르지 않습니다');
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await (supabase as unknown as UntypedRpcClient).rpc('update_task_board', {
    p_workspace_id: parsed.data.workspaceId,
    p_tasks: parsed.data.tasks,
  });

  if (error) {
    console.error('[task/updateTaskBoard] RPC 실패:', error);
    throw new Error('업무 정렬 저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }
}
