// 워크스페이스의 스프린트 목록 조회 — get_sprints RPC (포인트 집계·days_left 포함 단일 쿼리)
import { getSupabaseBrowserClient } from '@/shared/api/supabase/client';
import { toSprint } from '../model/sprint.mapper';
import type { Sprint } from '../model/sprint.types';

export async function getSprints(workspaceId: string): Promise<Sprint[]> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.rpc('get_sprints', { p_workspace_id: workspaceId });

  if (error) {
    throw new Error(`스프린트 목록 조회에 실패했습니다: ${error.message}`);
  }

  return (data ?? []).map(toSprint);
}
