// 진행률 차트 라우트 — 워크스페이스 존재/용도만 서버에서 판정하고, 데이터 조회·조립은 client 컨테이너(useQuery)에 위임한다.
// 선택 스프린트는 searchParam(?sprint=id)으로 읽어 client 컨테이너에 넘긴다(사이드 프로젝트 진행률에서만 사용).
import { ProgressChartPage } from '@/views/progress-chart';
import { assertWorkspaceRouteAccess } from '@/entities/workspace/lib/assert-workspace-route-access';

interface WorkspaceProgressChartPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
  searchParams: Promise<{ sprint?: string | string[] }>;
}

export default async function WorkspaceProgressChartPage({
  params,
  searchParams,
}: WorkspaceProgressChartPageProps) {
  const { workspaceId } = await params;
  const { sprint: sprintParam } = await searchParams;
  const selectedSprintId = typeof sprintParam === 'string' ? sprintParam : undefined;
  await assertWorkspaceRouteAccess(workspaceId, 'progress-chart');

  return <ProgressChartPage workspaceId={workspaceId} selectedSprintId={selectedSprintId} />;
}
