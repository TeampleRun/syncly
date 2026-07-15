// 대시보드 위젯 카탈로그 — 모든 템플릿에 들어갈 수 있는 위젯을 한 곳에서 관리한다.
// 각 항목이 렌더러 + 추가 시 기본 배치를 함께 가진다(템플릿별 구분 없음).
// id를 키로 두어, 여기서 WidgetId를 파생한다 → TEMPLATE_WIDGETS 등이 존재하지 않는 id를 쓰면 컴파일 에러.
// 대시보드는 빈 상태로 시작하고, 편집 모드에서 이 카탈로그의 위젯을 추가해 구성한다.
import type { WidgetDefinition } from '@/shared/dashboard/model/widget.types';
import { Backlog } from '@/widgets/side-project/dashboard-backlog';
import { Calendar } from '@/widgets/side-project/dashboard-calendar';
import { MyTasks } from '@/widgets/side-project/dashboard-my-tasks';
import { RecentNotes } from '@/widgets/side-project/dashboard-recent-notes';
import { SprintSummary } from '@/widgets/side-project/dashboard-sprint-summary';
import { TodaySchedule } from '@/widgets/side-project/dashboard-today-schedule';
import { Velocity } from '@/widgets/side-project/dashboard-velocity';
import { RecentNotices } from '@/widgets/store-operation/dashboard-recent-notices';
import { RecentResources } from '@/widgets/store-operation/dashboard-recent-resources';
import { WorkScheduleSummary } from '@/widgets/store-operation/dashboard-work-schedule';
import { OverallProgress } from '@/widgets/team-project/dashboard-overall-progress';
import { WorkSummary } from '@/widgets/team-project/dashboard-work-summary';

// layout의 x/y는 "추가될 때의 기본 위치"이며, 그리드가 충돌 시 자동 정렬한다.
// key는 layout.i(위젯 id)와 일치해야 한다.
// TODO: 모든 템플릿에 들어가는 위젯을 넣어두는 레지스트리파일
export const WIDGET_CATALOG = {
  'sprint-summary': {
    layout: { i: 'sprint-summary', x: 0, y: 0, w: 12, h: 4, minW: 6, minH: 4 },
    title: '스프린트 요약',
    render: (_size, { workspaceId }) => <SprintSummary workspaceId={workspaceId} />,
  },
  'my-tasks': {
    layout: { i: 'my-tasks', x: 0, y: 4, w: 6, h: 5, minW: 2, minH: 3 },
    title: '내 업무',
    render: (size, { workspaceId, purpose, currentUserId }) => (
      <MyTasks
        workspaceId={workspaceId}
        purpose={purpose}
        currentUserId={currentUserId}
        size={size}
      />
    ),
  },
  velocity: {
    layout: { i: 'velocity', x: 6, y: 4, w: 6, h: 5, minW: 4, minH: 4 },
    title: '벨로시티',
    render: (_size, { workspaceId }) => <Velocity workspaceId={workspaceId} />,
  },
  backlog: {
    layout: { i: 'backlog', x: 0, y: 9, w: 6, h: 5, minW: 2, minH: 3 },
    title: '백로그',
    render: (size, { workspaceId }) => <Backlog workspaceId={workspaceId} size={size} />,
  },
  'recent-notes': {
    layout: { i: 'recent-notes', x: 0, y: 14, w: 6, h: 5, minW: 2, minH: 3 },
    title: '최근 회의록',
    render: (size) => <RecentNotes size={size} />,
  },
  'recent-notices': {
    layout: { i: 'recent-notices', x: 0, y: 5, w: 6, h: 5, minW: 2, minH: 3 },
    title: '최근 공지',
    render: (size, { workspaceId }) => <RecentNotices workspaceId={workspaceId} size={size} />,
  },
  'recent-resources': {
    layout: { i: 'recent-resources', x: 0, y: 10, w: 6, h: 5, minW: 2, minH: 3 },
    title: '최근 자료',
    render: (size, { workspaceId }) => <RecentResources workspaceId={workspaceId} size={size} />,
  },
  'work-schedule': {
    layout: { i: 'work-schedule', x: 6, y: 10, w: 6, h: 5, minW: 3, minH: 3 },
    title: '업무 스케줄',
    render: (size, { workspaceId }) => (
      <WorkScheduleSummary workspaceId={workspaceId} size={size} />
    ),
  },
  'today-schedule': {
    layout: { i: 'today-schedule', x: 6, y: 9, w: 6, h: 4, minW: 2, minH: 3 },
    title: '오늘 일정',
    render: (size, { workspaceId }) => <TodaySchedule workspaceId={workspaceId} size={size} />,
  },
  'overall-progress': {
    layout: { i: 'overall-progress', x: 9, y: 10, w: 3, h: 5, minW: 3, minH: 4 },
    title: '전체 진행률',
    render: (size, { workspaceId }) => <OverallProgress workspaceId={workspaceId} size={size} />,
  },
  'work-summary': {
    layout: { i: 'work-summary', x: 0, y: 15, w: 12, h: 5, minW: 6, minH: 4 },
    title: '업무 요약',
    render: (size, { workspaceId }) => <WorkSummary workspaceId={workspaceId} size={size} />,
  },
  calendar: {
    layout: { i: 'calendar', x: 6, y: 13, w: 6, h: 8, minW: 4, minH: 6 },
    title: '캘린더',
    render: (size, { workspaceId }) => <Calendar workspaceId={workspaceId} size={size} />,
  },
} satisfies Record<string, WidgetDefinition>;

/** 카탈로그에 존재하는 위젯 id — 템플릿 목록 등에서 이 타입을 쓰면 오타·미존재 id가 컴파일 시점에 걸린다. */
export type WidgetId = keyof typeof WIDGET_CATALOG;
