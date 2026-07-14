'use client';

import { createProgressChartSummary } from '@/entities/progress-chart';
import { useTasksByWorkspaceId } from '@/entities/task';
import type { WidgetSize } from '@/shared/dashboard/lib/widget-size';
import { WidgetCard, WidgetCardAction, WidgetCardHeader } from '@/shared/dashboard/ui/widget-card';

export default function OverallProgress({
  workspaceId,
  size = 'md',
}: {
  workspaceId: string;
  size?: WidgetSize;
}) {
  const tasksQuery = useTasksByWorkspaceId(workspaceId);
  const isCompact = size === 'sm';

  if (tasksQuery.isPending) {
    return (
      <WidgetCard className={isCompact ? 'p-4' : 'px-6 py-5'}>
        <WidgetCardHeader
          title="전체 진행률"
          action={<WidgetCardAction className="text-[15px] font-bold">차트</WidgetCardAction>}
        />
        <div className="flex flex-1 items-center text-[14px] font-medium text-[#8b90ba]">
          진행률을 불러오는 중...
        </div>
      </WidgetCard>
    );
  }

  if (tasksQuery.isError) {
    return (
      <WidgetCard className={isCompact ? 'p-4' : 'px-6 py-5'}>
        <WidgetCardHeader
          title="전체 진행률"
          action={<WidgetCardAction className="text-[15px] font-bold">차트</WidgetCardAction>}
        />
        <div className="flex flex-1 flex-col items-start justify-center gap-3 text-[14px] font-medium text-[#8b90ba]">
          <p>진행률을 불러오지 못했습니다.</p>
          <button
            type="button"
            onClick={() => void tasksQuery.refetch()}
            className="text-brand rounded-full border border-[#d8dcff] px-3 py-1.5 text-[13px] font-semibold"
          >
            다시 시도
          </button>
        </div>
      </WidgetCard>
    );
  }

  const summary = createProgressChartSummary(tasksQuery.data);

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
