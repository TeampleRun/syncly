import { createProgressChartSummary } from '@/entities/progress-chart';
import { getMockTasksByWorkspaceId } from '@/entities/task';
import type { WidgetSize } from '@/shared/dashboard/lib/widget-size';
import { WidgetCard, WidgetCardAction, WidgetCardHeader } from '@/shared/dashboard/ui/widget-card';

export default function OverallProgress({
  workspaceId,
  size = 'md',
}: {
  workspaceId: string;
  size?: WidgetSize;
}) {
  const tasks = getMockTasksByWorkspaceId(workspaceId, 'team-workspace');
  const summary = createProgressChartSummary(tasks);
  const isCompact = size === 'sm';

  return (
    <WidgetCard className={isCompact ? 'p-4' : 'px-6 py-5'}>
      <WidgetCardHeader
        title="전체 진행률"
        action={<WidgetCardAction className="text-[15px] font-bold">차트</WidgetCardAction>}
      />
      <div className={`flex flex-1 flex-col ${isCompact ? 'pt-1' : 'pt-2'}`}>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[15px] font-medium tracking-[-0.03em] text-[#8b90ba]">완료</p>
          </div>
          <p
            className={`text-brand-ink font-extrabold tracking-[-0.05em] ${
              isCompact ? 'text-[17px]' : 'text-[22px]'
            }`}
          >
            {summary.doneTaskCount} / {summary.totalTaskCount}
          </p>
        </div>

        <div
          className={`${isCompact ? 'mt-5 h-[18px]' : 'mt-6 h-6'} rounded-full bg-[#eceffc] p-0.5`}
        >
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#534bf2_0%,#8a56ff_100%)]"
            style={{ width: `${summary.overallProgressRate}%` }}
          />
        </div>

        <p
          className={`font-medium tracking-[-0.03em] text-[#8b90ba] ${
            isCompact ? 'mt-5 text-[15px]' : 'mt-6 text-[18px]'
          }`}
        >
          {summary.overallProgressRate}% 달성
        </p>
      </div>
    </WidgetCard>
  );
}
