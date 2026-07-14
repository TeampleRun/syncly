'use server';

import { createSupabaseServerClient } from '@/shared/api/supabase/server';

import { toTaskBoardUpdate } from '../model/task.mapper';
import { updateTaskBoardSchema } from '../model/task.schema';

export async function updateTaskBoard(params: {
  workspaceId: string;
  tasks: Array<{
    id: string;
    status: 'todo' | 'in-progress' | 'done';
    sortOrder: number;
  }>;
}): Promise<void> {
  const parsed = updateTaskBoardSchema.safeParse(params);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? '입력값이 올바르지 않습니다');
  }

  const supabase = await createSupabaseServerClient();

  const results = await Promise.all(
    parsed.data.tasks.map((task) =>
      supabase
        .from('tasks')
        .update(toTaskBoardUpdate(task))
        .eq('id', task.id)
        .eq('workspace_id', parsed.data.workspaceId),
    ),
  );

  const failed = results.find((result) => result.error);

  if (failed?.error) {
    console.error('[task/updateTaskBoard] update 실패:', failed.error);
    throw new Error('업무 정렬 저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }
}
