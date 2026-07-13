// 태스크의 스프린트 편입/해제 — sprint_id 단일 컬럼 부분 수정이라 클라이언트 직접 update(convention §4)
// sprintId에 값을 주면 해당 스프린트로 편입, null이면 백로그로 이동.
import { getSupabaseBrowserClient } from '@/shared/api/supabase/client';

export async function updateTaskSprint(id: string, sprintId: string | null): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.from('tasks').update({ sprint_id: sprintId }).eq('id', id);

  if (error) {
    throw new Error(`스프린트 편입에 실패했습니다: ${error.message}`);
  }
}
