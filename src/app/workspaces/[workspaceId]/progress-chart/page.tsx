import { ProgressChartPage } from '@/views/progress-chart';

interface WorkspaceProgressChartPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

export default async function WorkspaceProgressChartPage({
  params,
}: WorkspaceProgressChartPageProps) {
  const { workspaceId } = await params;

  return <ProgressChartPage workspaceId={workspaceId} />;
}
