import { ProgressChartView } from '@/features/manage-progress-chart';
import { ProgressChartView as SideProjectProgressChartView } from '@/views/side-project/progress-chart';
import { getWorkspaceById } from '@/entities/workspace/api/get-workspace-by-id';
import { notFound } from 'next/navigation';

interface ProgressChartPageProps {
  workspaceId: string;
  /** 선택 스프린트(?sprint=id) — 사이드 프로젝트 진행률에서만 사용, 없으면 현재 스프린트로 폴백 */
  selectedSprintId?: string;
}

export default async function ProgressChartPage({
  workspaceId,
  selectedSprintId,
}: ProgressChartPageProps) {
  const workspace = await getWorkspaceById(workspaceId);
  if (!workspace) return notFound();

  if (workspace.purpose === 'side-project') {
    return (
      <SideProjectProgressChartView
        workspaceId={workspaceId}
        selectedSprintId={selectedSprintId}
      />
    );
  }
  return (
    <div className="bg-brand-surface min-h-full">
      <ProgressChartView workspaceId={workspaceId} />
    </div>
  );
}
