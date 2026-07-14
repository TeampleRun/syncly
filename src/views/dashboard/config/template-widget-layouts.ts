import type { LayoutItem } from 'react-grid-layout';

import type { WorkspacePurpose } from '@/shared/dashboard/model/template.types';

import type { WidgetId } from './widget-catalog';

type TemplateWidgetLayoutMap = Partial<Record<WidgetId, LayoutItem>>;

function getWidgetIds(layouts: TemplateWidgetLayoutMap) {
  return Object.keys(layouts) as WidgetId[];
}

const SIDE_PROJECT_WIDGET_LAYOUTS = {
  'sprint-summary': { i: 'sprint-summary', x: 0, y: 0, w: 12, h: 4 },
  'my-tasks': { i: 'my-tasks', x: 0, y: 4, w: 6, h: 5 },
  velocity: { i: 'velocity', x: 6, y: 4, w: 6, h: 5 },
  backlog: { i: 'backlog', x: 0, y: 9, w: 6, h: 5 },
  'today-schedule': { i: 'today-schedule', x: 6, y: 9, w: 6, h: 4 },
  'recent-notes': { i: 'recent-notes', x: 0, y: 14, w: 6, h: 5 },
  calendar: { i: 'calendar', x: 6, y: 13, w: 6, h: 8 },
} satisfies TemplateWidgetLayoutMap;

const STORE_OPERATION_WIDGET_LAYOUTS = {
  'recent-notices': { i: 'recent-notices', x: 0, y: 0, w: 6, h: 5 },
  'recent-resources': { i: 'recent-resources', x: 6, y: 0, w: 6, h: 5 },
  'work-schedule': { i: 'work-schedule', x: 0, y: 5, w: 6, h: 5 },
  calendar: { i: 'calendar', x: 6, y: 5, w: 6, h: 8 },
} satisfies TemplateWidgetLayoutMap;

const TEAM_PROJECT_WIDGET_LAYOUTS = {
  'work-summary': { i: 'work-summary', x: 0, y: 0, w: 12, h: 5 },
  'my-tasks': { i: 'my-tasks', x: 0, y: 5, w: 6, h: 5 },
  'recent-notices': { i: 'recent-notices', x: 6, y: 5, w: 6, h: 5 },
  'recent-notes': { i: 'recent-notes', x: 0, y: 10, w: 6, h: 5 },
  'recent-resources': { i: 'recent-resources', x: 6, y: 10, w: 6, h: 5 },
  'overall-progress': { i: 'overall-progress', x: 0, y: 15, w: 3, h: 5 },
  calendar: { i: 'calendar', x: 3, y: 15, w: 9, h: 8 },
} satisfies TemplateWidgetLayoutMap;

// 같은 위젯이라도 템플릿별로 함께 놓이는 조합이 다르기 때문에,
// "추가 시 기본 위치"는 purpose별 설정으로 분리해서 관리한다.
export const TEMPLATE_WIDGET_LAYOUTS = {
  'side-project': SIDE_PROJECT_WIDGET_LAYOUTS,
  'store-operation': STORE_OPERATION_WIDGET_LAYOUTS,
  'team-project': TEAM_PROJECT_WIDGET_LAYOUTS,
} satisfies Record<WorkspacePurpose, TemplateWidgetLayoutMap>;

export const TEMPLATE_WIDGETS: Record<WorkspacePurpose, WidgetId[]> = {
  'side-project': getWidgetIds(SIDE_PROJECT_WIDGET_LAYOUTS),
  'store-operation': getWidgetIds(STORE_OPERATION_WIDGET_LAYOUTS),
  'team-project': getWidgetIds(TEAM_PROJECT_WIDGET_LAYOUTS),
};

export function getTemplateWidgetLayout(purpose: WorkspacePurpose, widgetId: WidgetId) {
  const layouts = TEMPLATE_WIDGET_LAYOUTS[purpose] as TemplateWidgetLayoutMap;
  return layouts[widgetId];
}
