// 대시보드 위젯 레지스트리 — 각 타일의 그리드 기본 배치와 렌더러를 한곳에 모은다.
// 위젯을 추가/제거하려면 이 배열만 수정하면 된다.
import type { ReactNode } from 'react';
import type { Layout, LayoutItem } from 'react-grid-layout';

import { Backlog } from '@/widgets/dashboard/dashboard-backlog';
import { MyTasks } from '@/widgets/dashboard/dashboard-my-tasks';
import { RecentNotes } from '@/widgets/dashboard/dashboard-recent-notes';
import { SprintSummary } from '@/widgets/dashboard/dashboard-sprint-summary';
import { Velocity } from '@/widgets/dashboard/dashboard-velocity';

interface DashboardWidget {
  /** 그리드 기본 배치 (i는 위젯 식별자) */
  layout: LayoutItem;
  render: () => ReactNode;
}

// 12컬럼 기준 — 상단 요약(전체 폭), 하단 위젯 2×2
export const DASHBOARD_WIDGETS: DashboardWidget[] = [
  {
    layout: { i: 'sprint-summary', x: 0, y: 0, w: 12, h: 4, minW: 6, minH: 4 },
    render: () => <SprintSummary />,
  },
  { layout: { i: 'my-tasks', x: 0, y: 4, w: 6, h: 5, minW: 3, minH: 4 }, render: () => <MyTasks /> },
  { layout: { i: 'velocity', x: 6, y: 4, w: 6, h: 5, minW: 3, minH: 4 }, render: () => <Velocity /> },
  { layout: { i: 'backlog', x: 0, y: 9, w: 6, h: 5, minW: 3, minH: 4 }, render: () => <Backlog /> },
  {
    layout: { i: 'recent-notes', x: 6, y: 9, w: 6, h: 5, minW: 3, minH: 3 },
    render: () => <RecentNotes />,
  },
];

/** 초기/리셋용 레이아웃 */
export const DEFAULT_LAYOUT: Layout = DASHBOARD_WIDGETS.map((widget) => widget.layout);
