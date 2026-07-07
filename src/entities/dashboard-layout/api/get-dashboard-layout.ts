// 대시보드 레이아웃 조회 — DB 연동 자리.
// 저장분이 없으면(신규) 빈 레이아웃으로 시작한다 — 템플릿 기반 기본값/폴백은 두지 않는다.

import type { DashboardLayoutState } from '../model/dashboard-layout.types';

// TODO: DB 연동 — WORKSPACE_LAYOUTS에서 (workspace_id, user_id(세션), page_type) 기준 select
export async function getDashboardLayout(
  workspaceId: string,
  pageType: string,
): Promise<DashboardLayoutState> {
  void workspaceId;
  void pageType;
  return { layout: [] };
}
