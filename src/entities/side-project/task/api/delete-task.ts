'use server';

// 업무 삭제 서버액션
import { createSupabaseServerClient } from '@/shared/api/supabase/server';

export async function deleteTask(id: string): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('tasks').delete().eq('id', id);

  if (error) {
    console.error('[deleteTask] delete 실패:', error);
    throw new Error('업무 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }
}
