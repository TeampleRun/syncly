// 내 워크스페이스 목록 조회 — get_my_workspaces RPC (집계 포함 단일 쿼리, N+1 없음)
import { getSupabaseBrowserClient } from '@/shared/api/supabase/client';
import { DEV_USER_ID } from '@/shared/config/dev-user';
import { toUiPurpose } from '../model/purpose.mapper';
import type { WorkspaceSummary } from '../model/workspace.types';

export async function getMyWorkspaces(): Promise<WorkspaceSummary[]> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.rpc('get_my_workspaces', { p_user_id: DEV_USER_ID });

  if (error) {
    throw new Error(`워크스페이스 목록 조회에 실패했습니다: ${error.message}`);
  }

  return (data ?? []).map((row) => ({ ...row, purpose: toUiPurpose(row.purpose) }));
}
