import { ProgressChartView } from '@/features/manage-progress-chart';
import { ProgressChartView as SideProjectProgressChartView } from '@/views/side-project/progress-chart';
import { plusJakartaSans } from '@/shared/lib/fonts';
import { getWorkspaceById } from '@/entities/workspace/api/get-workspace-by-id';
import { notFound } from 'next/navigation';

interface ProgressChartPageProps {
  workspaceId: string;
}

export default async function ProgressChartPage({ workspaceId }: ProgressChartPageProps) {

  const workspace = await getWorkspaceById(workspaceId);
  if (!workspace) return notFound();

  if (workspace.purpose === 'side-project') {
    return <SideProjectProgressChartView workspaceId={workspaceId} />;
  }
  return (
    <div className={`${plusJakartaSans.className} bg-brand-surface min-h-full`}>
      <ProgressChartView workspaceId={workspaceId} />
    </div>
  );
}
