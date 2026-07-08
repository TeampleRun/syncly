// 대시보드 레이아웃 저장 상태 타입 — DB(WORKSPACE_LAYOUTS)의 layout jsonb 한 행에 직렬화된다.
// 화면에 배치된 위젯 = layout. 배치되지 않은 위젯은 카탈로그에서 "추가"로 꺼낸다(별도 hidden 개념 없음).
import type { Layout } from 'react-grid-layout';

export interface DashboardLayoutState {
  layout: Layout;
}
