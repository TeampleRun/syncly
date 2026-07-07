'use client';

// 공통 워크스페이스 사이드바, 헤더, 페이지 콘텐츠 프레임을 조합합니다.
import { useState } from 'react';
import { WorkspaceHeader } from './WorkspaceHeader';
import { WorkspaceSidebar } from './WorkspaceSidebar';
import { mockWorkspace } from '@/entities/workspace';
import { getWorkspaceNavigation } from '@/widgets/workspace-shell/lib/get-workspace-navigation';

interface WorkspaceShellProps {
  workspaceId: string;
  children: React.ReactNode;
}

export function WorkspaceShell({ workspaceId, children }: WorkspaceShellProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const workspace = mockWorkspace; // 나중에는 workspaceId로 Supabase 조회
  const navigationItems = getWorkspaceNavigation(workspace.purpose);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f7f8fc]">
      <WorkspaceSidebar
        workspace={workspace}
        workspaceId={workspaceId}
        isCollapsed={isSidebarCollapsed}
        navigationItems={navigationItems}
        onToggleCollapsed={() => setIsSidebarCollapsed((current) => !current)}
      />

      <div className="flex h-screen min-w-0 flex-1 flex-col">
        <WorkspaceHeader navigationItems={navigationItems} />
        <main className="min-h-0 flex-1 overflow-y-auto px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
