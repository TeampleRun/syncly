// 대시보드 레이아웃 저장 — DB 연동 자리(서버액션).
// layout jsonb 한 행 = DashboardLayoutState 통째. 드래그 중 잦은 호출은 debounce 필요.
'use server';

import type { DashboardLayoutState } from '../model/dashboard-layout.types';

// TODO: DB 연동 — WORKSPACE_LAYOUTS upsert (workspace_id, user_id(세션), page_type, layout)
export async function saveDashboardLayout(
  workspaceId: string,
  pageType: string,
  state: DashboardLayoutState,
): Promise<void> {
  void workspaceId;
  void pageType;
  void state;
}
