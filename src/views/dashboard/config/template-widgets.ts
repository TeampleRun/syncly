// 템플릿(purpose)별로 대시보드 편집 모드에서 "추가"할 수 있는 위젯 id 목록.
// WIDGET_CATALOG(전역)의 부분집합이며, 렌더·기본배치는 카탈로그가 담당한다.
// 값 타입이 WidgetId라 카탈로그에 없는 id를 적으면 컴파일 에러가 난다.
// 이 목록은 "추가 메뉴 스코프"만 정한다 — 레이아웃 조회/저장(user_id+workspace_id)과는 무관.
import type { WorkspacePurpose } from '@/shared/dashboard/model/template.types';

import type { WidgetId } from './widget-catalog';

export const TEMPLATE_WIDGETS: Record<WorkspacePurpose, WidgetId[]> = {
  // 사이드 프로젝트 — 개발 진척 전반
  'side-project': [
    'sprint-summary',
    'my-tasks',
    'velocity',
    'backlog',
    'recent-notes',
    'today-schedule',
    'calendar',
  ],
  // TODO: 매장운영 템플릿에 들어가는 위젯 생성, 추가, 수정
  // 매장운영 — 일정/업무/캘린더/회의록 (개발 지표 제외)
  'store-operation': ['work-schedule', 'calendar', 'recent-notices', 'recent-resources'],
  // TODO: 팀플 템플릿에 들어가는 위젯 생성, 추가, 수정
  // 팀 프로젝트 — 진척·협업
  'team-project': ['my-tasks', 'recent-notes', 'calendar', 'recent-notices', 'recent-resources'],
};
