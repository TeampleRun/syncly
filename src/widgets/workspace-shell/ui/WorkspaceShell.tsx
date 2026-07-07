'use client';

// 공통 워크스페이스 사이드바, 헤더, 페이지 콘텐츠 프레임을 조합합니다.
import { useState } from 'react';
import { WorkspaceHeader } from './WorkspaceHeader';
import { WorkspaceSidebar } from './WorkspaceSidebar';

interface WorkspaceShellProps {
  workspaceId: string;
  children: React.ReactNode;
}

export function WorkspaceShell({ workspaceId, children }: WorkspaceShellProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f7f8fc]">
      <WorkspaceSidebar
        workspaceId={workspaceId}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapsed={() => setIsSidebarCollapsed((current) => !current)}
      />

      <div className="flex h-screen min-w-0 flex-1 flex-col">
        <WorkspaceHeader />
        <main className="min-h-0 flex-1 overflow-y-auto px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
