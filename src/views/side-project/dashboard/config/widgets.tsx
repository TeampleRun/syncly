// 대시보드 위젯 레지스트리 — 각 타일의 그리드 기본 배치와 렌더러를 한곳에 모은다.
// render는 현재 타일 크기(sm/md/lg)를 받아 밀도가 다른 변형을 렌더할 수 있다.
import type { ReactNode } from 'react';
import type { Layout, LayoutItem } from 'react-grid-layout';

import type { WidgetSize } from '@/shared/side-project/lib/widget-size';
import { Backlog } from '@/widgets/side-project/dashboard-backlog';
import { MyTasks } from '@/widgets/side-project/dashboard-my-tasks';
import { RecentNotes } from '@/widgets/side-project/dashboard-recent-notes';
import { SprintSummary } from '@/widgets/side-project/dashboard-sprint-summary';
import { TodaySchedule } from '@/widgets/side-project/dashboard-today-schedule';
import { Velocity } from '@/widgets/side-project/dashboard-velocity';

interface DashboardWidget {
  /** 그리드 기본 배치 (i는 위젯 식별자) */
  layout: LayoutItem;
  /** 위젯 추가 목록에 표시할 이름 */
  title: string;
  render: (size: WidgetSize) => ReactNode;
}

// 12컬럼 기준 — 상단 요약(전체 폭), 하단 위젯 2×2
export const DASHBOARD_WIDGETS: DashboardWidget[] = [
  {
    layout: { i: 'sprint-summary', x: 0, y: 0, w: 12, h: 4, minW: 6, minH: 4 },
    title: '스프린트 요약',
    render: () => <SprintSummary />,
  },
  {
    layout: { i: 'my-tasks', x: 0, y: 4, w: 6, h: 5, minW: 2, minH: 3 },
    title: '내 업무',
    render: (size) => <MyTasks size={size} />,
  },
  {
    layout: { i: 'velocity', x: 6, y: 4, w: 6, h: 5, minW: 4, minH: 4 },
    title: '벨로시티',
    render: () => <Velocity />,
  },
  {
    layout: { i: 'backlog', x: 0, y: 9, w: 6, h: 5, minW: 2, minH: 3 },
    title: '백로그',
    render: (size) => <Backlog size={size} />,
  },
  {
    layout: { i: 'recent-notes', x: 6, y: 9, w: 6, h: 5, minW: 2, minH: 3 },
    title: '최근 회의록',
    render: (size) => <RecentNotes size={size} />,
  },
  {
    layout: { i: 'today-schedule', x: 0, y: 14, w: 3, h: 4, minW: 2, minH: 3 },
    title: '오늘 일정',
    render: (size) => <TodaySchedule size={size} />,
  },
];

/** 초기/리셋용 레이아웃 */
export const DEFAULT_LAYOUT: Layout = DASHBOARD_WIDGETS.map((widget) => widget.layout);
