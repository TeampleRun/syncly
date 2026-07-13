// 워크스페이스 상세 조회 — RSC에서 현재 세션의 RLS를 적용해 접근 가능한 워크스페이스만 반환한다.
import { cache } from 'react';
import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import { toUiPurpose } from '../model/purpose.mapper';
import type { Workspace } from '../model/workspace.types';

export const getWorkspaceById = cache(async (workspaceId: string): Promise<Workspace | null> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('workspaces')
    .select('id, name, description, purpose, invite_code')
    .eq('id', workspaceId)
    .maybeSingle();

  if (error) {
    throw new Error(`워크스페이스 조회에 실패했습니다: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description ?? undefined,
    purpose: toUiPurpose(data.purpose),
    inviteCode: data.invite_code,
  };
});
