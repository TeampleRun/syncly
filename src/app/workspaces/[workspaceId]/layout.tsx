// 워크스페이스 공통 사이드바와 헤더를 적용하는 라우트 레이아웃입니다.
import { WorkspaceShell } from '@/widgets/workspace-shell';

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    workspaceId: string;
  }>;
}

export default async function WorkspaceLayout({ children, params }: WorkspaceLayoutProps) {
  const { workspaceId } = await params;

  return <WorkspaceShell workspaceId={workspaceId}>{children}</WorkspaceShell>;
}
