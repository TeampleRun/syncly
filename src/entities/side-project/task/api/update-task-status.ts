// 칸반 DnD 상태 이동 — 단일 컬럼 부분 수정이라 클라이언트 직접 update(supabase-convention §4)
import { getSupabaseBrowserClient } from '@/shared/api/supabase/client';
import type { TaskStatus } from '../model/task.types';

export async function updateTaskStatus(id: string, status: TaskStatus): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.from('tasks').update({ status }).eq('id', id);

  if (error) {
    throw new Error(`업무 상태 변경에 실패했습니다: ${error.message}`);
  }
}
