// 진행률 차트 라우트 — 워크스페이스 존재/용도만 서버에서 판정하고, 데이터 조회·조립은 client 컨테이너(useQuery)에 위임한다.
import { ProgressChartPage } from '@/views/progress-chart';
import { assertWorkspaceRouteAccess } from '@/entities/workspace/lib/assert-workspace-route-access';

interface WorkspaceProgressChartPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

export default async function WorkspaceProgressChartPage({
  params,
}: WorkspaceProgressChartPageProps) {
  const { workspaceId } = await params;
  await assertWorkspaceRouteAccess(workspaceId, 'progress-chart');

  return <ProgressChartPage workspaceId={workspaceId} />;
}
