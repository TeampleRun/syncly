// 사이드 프로젝트 대시보드 페이지 — 위젯 그리드와 레이아웃 편집 기능을 조립한다.
// 편집 상태/토글은 edit-dashboard-layout feature가 담당하고, 뷰는 기본 레이아웃만 주입한다.
// AppShell(사이드바/탑바 슬롯)과 폰트는 상위 워크스페이스 layout이 담당한다.
'use client';

import {
  DashboardEditToggle,
  useDashboardLayout,
} from '@/features/side-project/edit-dashboard-layout';

import { DEFAULT_LAYOUT } from '../config/widgets';
import DashboardGrid from './DashboardGrid';

export default function DashboardPage() {
  const { layout, editMode, handleLayoutChange, toggleEdit } = useDashboardLayout(DEFAULT_LAYOUT);

  return (
    <>
      <DashboardGrid layout={layout} editMode={editMode} onLayoutChange={handleLayoutChange} />
      <DashboardEditToggle editing={editMode} onToggle={toggleEdit} />
    </>
  );
}
