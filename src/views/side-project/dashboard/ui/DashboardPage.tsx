// 사이드 프로젝트 대시보드 페이지 — 위젯 그리드와 레이아웃 편집 기능을 조립한다.
// 편집 상태/토글/추가·삭제는 edit-dashboard-layout feature가 담당하고, 뷰는 위젯 목록/기본 배치를 주입한다.
// AppShell(사이드바/탑바 슬롯)과 폰트는 상위 워크스페이스 layout이 담당한다.
'use client';

import {
  DashboardEditToggle,
  EditModeBanner,
  useDashboardLayout,
} from '@/features/side-project/edit-dashboard-layout';

import { DASHBOARD_WIDGETS, DEFAULT_LAYOUT } from '../config/widgets';
import AddWidgetBar from './AddWidgetBar';
import DashboardGrid from './DashboardGrid';

export default function DashboardPage() {
  const { layout, hiddenIds, editMode, handleLayoutChange, removeWidget, addWidget, toggleEdit } =
    useDashboardLayout(DEFAULT_LAYOUT);

  const hiddenWidgets = DASHBOARD_WIDGETS.filter((widget) =>
    hiddenIds.includes(widget.layout.i),
  ).map((widget) => ({ id: widget.layout.i, title: widget.title }));

  return (
    <>
      {editMode && <EditModeBanner />}
      <DashboardGrid
        layout={layout}
        editMode={editMode}
        hiddenIds={hiddenIds}
        onLayoutChange={handleLayoutChange}
        onRemove={removeWidget}
      />
      {editMode && <AddWidgetBar hidden={hiddenWidgets} onAdd={addWidget} />}
      <DashboardEditToggle editing={editMode} onToggle={toggleEdit} />
    </>
  );
}
