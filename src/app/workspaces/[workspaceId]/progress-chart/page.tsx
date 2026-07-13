// 진행률 차트 라우트 — 워크스페이스 존재/용도만 서버에서 판정하고, 데이터 조회·조립은 client 컨테이너(useQuery)에 위임한다.
import { notFound } from 'next/navigation';
import { ProgressChartView } from '@/views/side-project/progress-chart';
import { getWorkspaceById } from '@/entities/workspace/api/get-workspace-by-id';

interface ProgressChartRouteProps {
  params: Promise<{ workspaceId: string }>;
}

export default async function ProgressChartPage({ params }: ProgressChartRouteProps) {
  const { workspaceId } = await params;

  const workspace = await getWorkspaceById(workspaceId);
  if (!workspace) return notFound();

  if (workspace.purpose === 'side-project') {
    return <ProgressChartView workspaceId={workspaceId} />;
  }

  //TODO: 다른 워크스페이스 용도(team-project 등)별 진행률 뷰
  return <></>;
}
