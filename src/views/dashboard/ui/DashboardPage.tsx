// 사이드 프로젝트 대시보드 페이지 — AppShell(빈 사이드바/탑바 슬롯) 안에
// 위젯 그리드와 레이아웃 편집 토글을 조립한다.
'use client';

import { Plus_Jakarta_Sans } from 'next/font/google';

import { DashboardEditToggle } from '@/widgets/dashboard/dashboard-edit-toggle';
import { AppShell } from '@/widgets/layout/app-shell';

import { useDashboardLayout } from '../model/useDashboardLayout';
import DashboardGrid from './DashboardGrid';

// Figma 지정 폰트 (랜딩과 동일) — 한글은 시스템 폰트로 fallback
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
});

export default function DashboardPage() {
  const { layout, editMode, handleLayoutChange, toggleEdit } = useDashboardLayout();

  return (
    <div className={jakarta.className}>
      <AppShell>
        <DashboardGrid layout={layout} editMode={editMode} onLayoutChange={handleLayoutChange} />
      </AppShell>
      <DashboardEditToggle editing={editMode} onToggle={toggleEdit} />
    </div>
  );
}
