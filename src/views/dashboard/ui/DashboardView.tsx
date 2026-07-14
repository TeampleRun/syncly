// 대시보드 — 카탈로그(위젯 전체)와 훅이 관리하는 배치(layout)를 id로 조인해 그린다.
//   · 배치 상태·추가/삭제·영속화 → edit-layout 훅 (레이아웃은 user_id+workspace_id로 조회/저장)
//   · 위젯 렌더                   → WIDGET_CATALOG (전역)
//   · 추가 메뉴/기본 배치         → 템플릿별 widget config (purpose 기준)
//   · AppShell(사이드바/탑바)·폰트 → 상위 워크스페이스 layout 담당
// 빈 상태로 시작하고, 편집 모드에서 이 템플릿이 허용하는 위젯을 추가해 구성한다.
'use client';

import {
  DashboardEditToggle,
  EditModeBanner,
  useDashboardLayout,
} from '@/features/dashboard/edit-layout';
import type { DashboardLayoutState } from '@/entities/dashboard-layout/model/dashboard-layout.types';
import type { WorkspacePurpose } from '@/shared/dashboard/model/template.types';

import { getTemplateWidgetLayout, TEMPLATE_WIDGETS } from '../config/template-widgets';
import { WIDGET_CATALOG, type WidgetId } from '../config/widget-catalog';
import AddWidgetBar from './AddWidgetBar';
import DashboardGrid from './DashboardGrid';

const CATALOG_WIDGETS = Object.values(WIDGET_CATALOG);

interface DashboardViewProps {
  /** 레이아웃 영속화 키 */
  workspaceId: string;
  /** 워크스페이스 용도 — 추가 가능한 위젯을 템플릿별로 거른다(레이아웃 조회와는 무관) */
  purpose: WorkspacePurpose;
  /** 서버(RSC)에서 조회한 초기 레이아웃 */
  initialLayout: DashboardLayoutState;
  /** 향후 페이지별 레이아웃 확장을 위한 구분값 — 현재 DB에는 저장하지 않는다 */
  pageType?: string;
}

export default function DashboardView({
  workspaceId,
  purpose,
  initialLayout,
  pageType = 'dashboard',
}: DashboardViewProps) {
  const { layout, editMode, handleLayoutChange, addWidget, removeWidget, toggleEdit } =
    useDashboardLayout({ workspaceId, pageType, initialLayout });

  // 이 템플릿이 허용하는 위젯 중, 아직 배치되지 않은 것 = 추가 가능 목록
  // TEMPLATE_WIDGETS[purpose]는 WidgetId[]라 카탈로그에 항상 존재한다.
  const placed = new Set(layout.map((item) => item.i));
  const available = TEMPLATE_WIDGETS[purpose]
    .filter((id) => !placed.has(id))
    .map((id) => ({ id, title: WIDGET_CATALOG[id].title }));

  const handleAdd = (id: string) => {
    if (!(id in WIDGET_CATALOG)) return;

    const defaultLayout = getTemplateWidgetLayout(purpose, id as WidgetId);

    if (!defaultLayout) return;
    addWidget(defaultLayout);
  };

  return (
    <>
      {editMode && <EditModeBanner />}
      <DashboardGrid
        workspaceId={workspaceId}
        widgets={CATALOG_WIDGETS}
        layout={layout}
        editMode={editMode}
        onLayoutChange={handleLayoutChange}
        onRemove={removeWidget}
      />
      {editMode && <AddWidgetBar available={available} onAdd={handleAdd} />}
      <DashboardEditToggle editing={editMode} onToggle={toggleEdit} />
    </>
  );
}
