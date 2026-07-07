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
  // 임시 목 저장분 — DB의 layout jsonb를 흉내낸다. 위치(i,x,y,w,h)만 담고,
  // 제약(minW/minH)은 저장하지 않는다(렌더 시 카탈로그에서 머지됨).
  return {
    layout: [
      { i: 'my-tasks', x: 0, y: 0, w: 12, h: 5 },
      { i: 'velocity', x: 0, y: 5, w: 6, h: 5 },
      { i: 'calendar', x: 6, y: 5, w: 6, h: 8 },
      { i: 'recent-notes', x: 0, y: 13, w: 6, h: 5 },
    ],
  };
}
