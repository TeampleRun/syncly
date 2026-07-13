'use server';

// 스프린트 생성 서버액션 — 검증 후 sprints insert (단일 테이블 → RPC 불필요)
import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import { toSprintInsert } from '../model/sprint.mapper';
import { sprintInputSchema, type SprintInput } from '../model/sprint.schema';

interface CreateSprintParams {
  input: SprintInput;
  workspaceId: string;
}

export async function createSprint({ input, workspaceId }: CreateSprintParams): Promise<void> {
  const parsed = sprintInputSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? '입력값이 올바르지 않습니다');
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('sprints').insert(toSprintInsert(parsed.data, workspaceId));

  if (error) {
    console.error('[createSprint] insert 실패:', error);
    throw new Error('스프린트 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }
}
