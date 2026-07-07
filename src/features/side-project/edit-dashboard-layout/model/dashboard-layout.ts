// 대시보드 레이아웃 저장 상태 타입 (api ↔ hook 공유)
import type { Layout } from 'react-grid-layout';

export interface DashboardLayoutState {
  layout: Layout;
  /** 숨긴(삭제한) 위젯 id 목록 */
  hiddenIds: string[];
}
