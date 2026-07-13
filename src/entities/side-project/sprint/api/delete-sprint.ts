'use server';

// 스프린트 삭제 서버액션 — sprints delete.
// 편입돼 있던 태스크는 FK(on delete set null)로 sprint_id=null이 되어 백로그로 이동한다(수동 cascade 불필요).
import { createSupabaseServerClient } from '@/shared/api/supabase/server';

export async function deleteSprint(id: string): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('sprints').delete().eq('id', id);

  if (error) {
    console.error('[deleteSprint] delete 실패:', error);
    throw new Error('스프린트 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }
}
