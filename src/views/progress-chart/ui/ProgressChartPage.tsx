// side-project 진행률만 실 DB 연동 완료.
// 그 외 purpose는 manage-progress-chart 뷰(다른 담당자, mock 기반) — 실 API 연동 전이라
// workspaceId 'test' 하드코딩 상태. 실 연동은 해당 담당자 작업으로 남김.
// TODO(담당자): ProgressChartView 실 API 연동 + workspaceId={workspaceId} 전달
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
      <ProgressChartView workspaceId={'test'} />
    </div>
  );
}
