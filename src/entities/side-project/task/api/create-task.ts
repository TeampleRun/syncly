'use server';

// 업무 생성 서버액션 — 검증 후 tasks insert (created_by는 서버에서 현재 유저로 채운다)
import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import { DEV_USER_ID } from '@/shared/config/dev-user';
import { toTaskInsert } from '../model/task.mapper';
import { taskInputSchema, type TaskInput } from '../model/task.schema';

interface CreateTaskParams {
  input: TaskInput;
  workspaceId: string;
  /** 편입할 스프린트 id. null이면 백로그로 생성 */
  sprintId: string | null;
}

export async function createTask({
  input,
  workspaceId,
  sprintId,
}: CreateTaskParams): Promise<void> {
  // 클라이언트 검증과 별개로 서버에서 재검증한다
  const parsed = taskInputSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? '입력값이 올바르지 않습니다');
  }

  const supabase = await createSupabaseServerClient();
  const payload = toTaskInsert(parsed.data, { workspaceId, sprintId, createdBy: DEV_USER_ID });
  const { error } = await supabase.from('tasks').insert(payload);

  if (error) {
    console.error('[createTask] insert 실패:', error);
    throw new Error('업무 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }
}
