// 워크스페이스 공통 사이드바와 헤더를 적용하는 라우트 레이아웃입니다.
import { notFound } from 'next/navigation';
import { getMockWorkspaceById } from '@/entities/workspace';
import { WorkspaceShell } from '@/widgets/workspace-shell';

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    workspaceId: string;
  }>;
}

export default async function WorkspaceLayout({ children, params }: WorkspaceLayoutProps) {
  const { workspaceId } = await params;
  const workspace = getMockWorkspaceById(workspaceId);

  if (!workspace) {
    notFound();
  }

  return (
    <WorkspaceShell workspace={workspace} workspaceId={workspaceId}>
      {children}
    </WorkspaceShell>
  );
}
