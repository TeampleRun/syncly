// 현재 사용자의 워크스페이스별 대시보드 레이아웃을 JSONB 한 행으로 upsert하는 서버 액션입니다.
'use server';

import { getCurrentUserId } from '@/shared/api/supabase/current-user';
import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import type { LayoutItem } from 'react-grid-layout';
import type { DashboardLayoutState } from '../model/dashboard-layout.types';

function toStoredLayout(layout: DashboardLayoutState['layout']) {
  return layout.map(({ i, x, y, w, h }: LayoutItem) => ({ i, x, y, w, h }));
}

export async function saveDashboardLayout(
  workspaceId: string,
  pageType: string,
  state: DashboardLayoutState,
): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const userId = await getCurrentUserId();
  const { error } = await supabase.from('user_dashboard_layouts').upsert(
    {
      user_id: userId,
      workspace_id: workspaceId,
      layout: toStoredLayout(state.layout),
    },
    { onConflict: 'user_id,workspace_id' },
  );

  if (error) throw new Error(`대시보드 레이아웃 저장에 실패했습니다: ${error.message}`);
  void pageType;
}
