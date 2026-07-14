'use client';

// 공통 워크스페이스 사이드바, 헤더, 페이지 콘텐츠 프레임을 조합합니다.
import { useState } from 'react';
import type { Workspace } from '@/entities/workspace';
import type { WorkspaceMember } from '@/entities/workspace-member';
import { WorkspaceHeader } from './WorkspaceHeader';
import { WorkspaceSidebar } from './WorkspaceSidebar';
import { getWorkspaceNavigation } from '@/widgets/workspace-shell/lib/get-workspace-navigation';

interface WorkspaceShellProps {
  workspace: Workspace;
  workspaceId: string;
  currentMember: WorkspaceMember;
  children: React.ReactNode;
}

export function WorkspaceShell({
  workspace,
  workspaceId,
  currentMember,
  children,
}: WorkspaceShellProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigationItems = getWorkspaceNavigation(workspace.purpose);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f7f8fc]">
      <WorkspaceSidebar
        workspace={workspace}
        workspaceId={workspaceId}
        isCollapsed={isSidebarCollapsed}
        navigationItems={navigationItems}
        onToggleCollapsed={() => setIsSidebarCollapsed((current) => !current)}
        currentMember={currentMember}
      />

      <div className="flex h-screen min-w-0 flex-1 flex-col">
        <WorkspaceHeader navigationItems={navigationItems} currentMember={currentMember} />
        <main className="min-h-0 flex-1 overflow-y-auto px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
