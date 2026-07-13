'use server';

// 업무 수정 서버액션 — 검증 후 편집 가능 필드만 update
import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import { toTaskUpdate } from '../model/task.mapper';
import { taskInputSchema, type TaskInput } from '../model/task.schema';

interface UpdateTaskParams {
  id: string;
  input: TaskInput;
}

export async function updateTask({ id, input }: UpdateTaskParams): Promise<void> {
  const parsed = taskInputSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? '입력값이 올바르지 않습니다');
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('tasks').update(toTaskUpdate(parsed.data)).eq('id', id);

  if (error) {
    console.error('[updateTask] update 실패:', error);
    throw new Error('업무 수정에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }
}
