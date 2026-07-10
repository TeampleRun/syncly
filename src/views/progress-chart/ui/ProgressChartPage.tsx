import { ProgressChartView } from '@/features/manage-progress-chart';
import { plusJakartaSans } from '@/shared/lib/fonts';

interface ProgressChartPageProps {
  workspaceId: string;
}

export default function ProgressChartPage({ workspaceId }: ProgressChartPageProps) {
  return (
    <div className={`${plusJakartaSans.className} bg-brand-surface min-h-full`}>
      <ProgressChartView workspaceId={workspaceId} />
    </div>
  );
}
