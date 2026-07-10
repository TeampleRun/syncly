'use client';

import type { ProgressChartAssigneeItem, ProgressChartStatusItem } from '@/entities/progress-chart';
import { getMockTasksByWorkspaceId } from '@/entities/task';
import { cn } from '@/shared/lib/utils';
import { createProgressChartSummary } from '../model/progress-chart';

interface ProgressChartViewProps {
  workspaceId: string;
}

function SummaryNumberCard({
  value,
  label,
  valueClassName,
}: {
  value: number;
  label: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex min-h-[214px] items-center justify-center rounded-[22px] border border-[#e7eaff] bg-white px-7 py-8 shadow-[0_6px_20px_rgba(91,78,232,0.03)]">
      <div className="text-center">
        <strong
          className={cn(
            'text-brand-ink text-[46px] leading-none font-extrabold tracking-[-0.06em]',
            valueClassName,
          )}
        >
          {value}
        </strong>
        <p className="mt-2.5 text-[15px] font-semibold tracking-[-0.04em] text-[#9ca2c5]">
          {label}
        </p>
      </div>
    </div>
  );
}

function OverallProgressCard({
  progress,
  doneCount,
  totalCount,
}: {
  progress: number;
  doneCount: number;
  totalCount: number;
}) {
  const safeProgress = Math.max(progress, 0);

  return (
    <div className="rounded-[22px] border border-[#e7eaff] bg-white px-6 pt-9 pb-10 shadow-[0_6px_20px_rgba(91,78,232,0.03)]">
      <h2 className="text-brand-ink text-[17px] font-bold tracking-[-0.04em]">전체 진행률</h2>
      <p className="mt-2 text-[13px] font-medium tracking-[-0.03em] text-[#98a0c6]">
        {doneCount} / {totalCount} 업무 완료
      </p>

      <div className="mt-5 h-6 overflow-hidden rounded-full bg-[#eceffc]">
        <div
          className="flex h-full items-center justify-end rounded-full bg-[linear-gradient(90deg,#534bf2_0%,#8a56ff_100%)] pr-4"
          style={{ width: `${safeProgress}%` }}
        >
          <span className="text-[12px] font-bold tracking-[-0.02em] text-white">
            {safeProgress}%
          </span>
        </div>
      </div>
    </div>
  );
}

function AssigneeBarChartCard({ items }: { items: ProgressChartAssigneeItem[] }) {
  const maxValue = Math.max(...items.map((item) => item.count), 0);
  const gridValues = [0, 2, 4, 6, 8];

  return (
    <div className="row-span-2 rounded-[22px] border border-[#e7eaff] bg-white px-6 pt-6 pb-5 shadow-[0_6px_20px_rgba(91,78,232,0.03)]">
      <h2 className="text-brand-ink text-[17px] font-bold tracking-[-0.04em]">
        담당자별 업무 현황
      </h2>

      <div className="mt-6 grid grid-cols-[28px_1fr] gap-3">
        <div className="flex h-[326px] flex-col justify-between pb-8 text-right text-[11px] font-medium text-[#9aa2c7]">
          {gridValues
            .slice()
            .reverse()
            .map((value) => (
              <span key={value}>{value}</span>
            ))}
        </div>

        <div className="relative h-[326px]">
          <div className="absolute inset-0 flex flex-col justify-between pb-8">
            {gridValues
              .slice(1)
              .reverse()
              .map((value) => (
                <div key={value} className="border-t border-dashed border-[#eceef8]" />
              ))}
            <div className="border-t border-dashed border-[#eceef8]" />
          </div>

          <div className="relative flex h-full items-end justify-around gap-6 pb-8">
            {items.map((item) => (
              <div key={item.name} className="flex h-full flex-1 flex-col items-center justify-end">
                <div
                  className="w-full max-w-[18px] rounded-t-[7px] bg-[#ddd9ff]"
                  style={{
                    height: `${maxValue === 0 ? 0 : (item.count / maxValue) * 214}px`,
                  }}
                />
                <span className="mt-3 text-[13px] font-medium tracking-[-0.03em] text-[#8f97bf]">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusDistributionCard({ items }: { items: ProgressChartStatusItem[] }) {
  const total = items.reduce((sum, item) => sum + item.count, 0);
  const segments = items
    .map((item, index) => {
      const start = items
        .slice(0, index)
        .reduce((sum, current) => sum + (total === 0 ? 0 : (current.count / total) * 100), 0);
      const end = start + (total === 0 ? 0 : (item.count / total) * 100);

      return `${item.color} ${start}% ${end}%`;
    })
    .join(', ');

  return (
    <div className="rounded-[22px] border border-[#e7eaff] bg-white px-6 pt-6 pb-7 shadow-[0_6px_20px_rgba(91,78,232,0.03)]">
      <h2 className="text-brand-ink text-[17px] font-bold tracking-[-0.04em]">상태 분포</h2>

      <div className="flex flex-col items-center justify-center gap-8 pt-9 pb-1 lg:flex-row">
        <div
          className="relative size-[152px] rounded-full"
          style={{
            background: `conic-gradient(${segments})`,
          }}
        >
          <div className="absolute inset-[28px] rounded-full bg-white" />
        </div>

        <div className="min-w-[146px] space-y-4.5">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <span
                className="size-[14px] rounded-full"
                style={{ backgroundColor: item.color }}
                aria-hidden="true"
              />
              <div className="flex min-w-[116px] items-center justify-between gap-5">
                <span className="text-brand-ink text-[15px] font-semibold tracking-[-0.03em]">
                  {item.label}
                </span>
                <strong className="text-brand-ink text-[15px] font-extrabold tracking-[-0.04em]">
                  {item.count}건
                </strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProgressChartView({ workspaceId }: ProgressChartViewProps) {
  const tasks = getMockTasksByWorkspaceId(workspaceId);
  const summary = createProgressChartSummary(tasks);

  return (
    <section className="w-full max-w-[1280px]">
      <header className="mb-6">
        <h1 className="text-brand-ink text-[28px] leading-[1.15] font-extrabold tracking-[-0.05em]">
          진행률 차트
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <SummaryNumberCard value={summary.totalTaskCount} label="전체 업무" />
        </div>
        <div className="xl:col-span-4">
          <SummaryNumberCard
            value={summary.doneTaskCount}
            label="완료"
            valueClassName="text-[#00b73d]"
          />
        </div>
        <div className="xl:col-span-4">
          <SummaryNumberCard
            value={summary.inProgressTaskCount}
            label="진행 중"
            valueClassName="text-[#615bff]"
          />
        </div>

        <div className="xl:col-span-6">
          <OverallProgressCard
            progress={summary.overallProgressRate}
            doneCount={summary.doneTaskCount}
            totalCount={summary.totalTaskCount}
          />
        </div>
        <div className="xl:col-span-6 xl:row-span-2">
          <AssigneeBarChartCard items={summary.assigneeItems} />
        </div>

        <div className="xl:col-span-6">
          <StatusDistributionCard items={summary.statusItems} />
        </div>
      </div>
    </section>
  );
}
