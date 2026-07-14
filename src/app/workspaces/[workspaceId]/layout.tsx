// 워크스페이스 공통 사이드바와 헤더를 적용하는 라우트 레이아웃입니다.
import { notFound } from 'next/navigation';
import { getWorkspaceById } from '@/entities/workspace/api/get-workspace-by-id';
import { getCurrentWorkspaceMember } from '@/entities/workspace-member/api/get-current-workspace-member';
import { WorkspaceShell } from '@/widgets/workspace-shell';

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    workspaceId: string;
  }>;
}

export default async function WorkspaceLayout({ children, params }: WorkspaceLayoutProps) {
  const { workspaceId } = await params;
  const [workspace, currentMember] = await Promise.all([
    getWorkspaceById(workspaceId),
    getCurrentWorkspaceMember(workspaceId),
  ]);

  if (!workspace || !currentMember) {
    notFound();
  }

  return (
    <WorkspaceShell workspace={workspace} workspaceId={workspaceId} currentMember={currentMember}>
      {children}
    </WorkspaceShell>
  );
}
