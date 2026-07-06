// 사이드 프로젝트 대시보드 페이지 — 위젯 그리드와 레이아웃 편집 토글을 조립한다.
// AppShell(사이드바/탑바 슬롯)과 폰트는 상위 워크스페이스 layout이 담당한다.
'use client';

import { DashboardEditToggle } from '@/widgets/dashboard/dashboard-edit-toggle';

import { useDashboardLayout } from '../model/useDashboardLayout';
import DashboardGrid from './DashboardGrid';

export default function DashboardPage() {
  const { layout, editMode, handleLayoutChange, toggleEdit } = useDashboardLayout();

  return (
    <>
      <DashboardGrid layout={layout} editMode={editMode} onLayoutChange={handleLayoutChange} />
      <DashboardEditToggle editing={editMode} onToggle={toggleEdit} />
    </>
  );
}
