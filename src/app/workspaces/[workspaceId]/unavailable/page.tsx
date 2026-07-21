// 목적에 맞지 않는 워크스페이스 전용 모듈에 직접 접근했을 때 표시하는 라우트입니다.
import { WorkspaceUnavailableView } from '@/views/workspace-unavailable';

interface WorkspaceUnavailablePageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

export default async function WorkspaceUnavailablePage({ params }: WorkspaceUnavailablePageProps) {
  const { workspaceId } = await params;

  return <WorkspaceUnavailableView workspaceId={workspaceId} />;
}
