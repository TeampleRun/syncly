// 워크스페이스 대시보드 라우트 — 레이아웃은 (user_id, workspace_id, page_type)로 조회되고,
// purpose는 추가 가능한 위젯을 템플릿별로 거르는 데만 쓰인다. 저장분이 없으면 빈 대시보드로 시작한다.
import { getWorkspace } from '@/entities/workspace';
import { DashboardView } from '@/views/dashboard';

interface DashboardPageProps {
  params: Promise<{ workspaceId: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { workspaceId } = await params;
  const { purpose } = await getWorkspace(workspaceId); //  템플릿 별 추가 가능한 위젯 목록을 넘겨주기 위해 purpose필요 추후 db연동시 추가 예정 현재는 side-project로 하드코딩

  return <DashboardView workspaceId={workspaceId} purpose={'side-project'} />;
}
