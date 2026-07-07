// 대시보드 레이아웃 영속화 — DB 연동 자리(서버액션).
// 현재는 stub이며, 추후 Supabase 등으로 워크스페이스/유저 기준 저장·조회를 구현한다.
'use server';

import type { DashboardLayoutState } from '../model/dashboard-layout';

// TODO: DB 연동 — 저장된 대시보드 레이아웃 조회 (워크스페이스/유저 기준)
export async function getDashboardLayout(): Promise<DashboardLayoutState | null> {
  // TODO: supabase에서 select 후 DashboardLayoutState 반환
  return null;
}

// TODO: DB 연동 — 대시보드 레이아웃 저장(upsert). 잦은 호출은 debounce 필요.
export async function saveDashboardLayout(state: DashboardLayoutState): Promise<void> {
  // TODO: supabase에 upsert
  void state;
}
