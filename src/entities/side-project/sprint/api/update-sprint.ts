'use server';

// 스프린트 수정 서버액션 — 검증 후 sprints update
import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import { toSprintUpdate } from '../model/sprint.mapper';
import { sprintInputSchema, type SprintInput } from '../model/sprint.schema';

interface UpdateSprintParams {
  id: string;
  input: SprintInput;
}

export async function updateSprint({ id, input }: UpdateSprintParams): Promise<void> {
  const parsed = sprintInputSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? '입력값이 올바르지 않습니다');
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('sprints').update(toSprintUpdate(parsed.data)).eq('id', id);

  if (error) {
    console.error('[updateSprint] update 실패:', error);
    throw new Error('스프린트 수정에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }
}
