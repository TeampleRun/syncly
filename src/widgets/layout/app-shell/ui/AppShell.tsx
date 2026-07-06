// AppShell — 워크스페이스 공통 레이아웃(사이드바 + 탑바 + 메인)
// 사이드바/탑바는 다른 작업자가 구현 예정이므로 슬롯(props)만 열어두고
// 지금은 Figma와 동일한 치수의 빈 영역을 유지한다. 실제 컴포넌트가 완성되면
// <AppShell sidebar={<WorkspaceSidebar />} topbar={<WorkspaceTopbar />}> 로 끼워넣기만 하면 된다.
import type { ReactNode } from 'react';

interface AppShellProps {
  sidebar?: ReactNode;
  topbar?: ReactNode;
  children: ReactNode;
}

export default function AppShell({ sidebar, topbar, children }: AppShellProps) {
  return (
    <div className="bg-brand-surface flex h-screen overflow-hidden">
      {/* 사이드바 슬롯 (Figma 폭 221px) */}
      <aside className="w-[220px] shrink-0 border-r border-brand/10 bg-white">{sidebar}</aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* 탑바 슬롯 (Figma 높이 55px) */}
        <header className="h-14 shrink-0 border-b border-brand/10 bg-white">{topbar}</header>

        <main className="min-h-0 flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
