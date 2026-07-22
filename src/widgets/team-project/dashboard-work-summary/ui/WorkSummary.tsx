'use client';

import { createProgressChartSummary } from '@/entities/progress-chart';
import { useTasksByWorkspaceId } from '@/entities/task';
import { useWorkspaceMembersByWorkspaceId } from '@/entities/workspace-member';
import type { WidgetSize } from '@/shared/dashboard/lib/widget-size';

const cardMeta: Record<
  'total' | 'done' | 'in-progress' | 'members',
  {
    label: string;
    valueClassName: string;
  }
> = {
  total: {
    label: '전체 업무',
    valueClassName: 'text-[#4f46e5]',
  },
  done: {
    label: '완료된 업무',
    valueClassName: 'text-[#16a34a]',
  },
  'in-progress': {
    label: '진행중',
    valueClassName: 'text-[#eb7a00]',
  },
  members: {
    label: '팀 멤버',
    valueClassName: 'text-[#8b3dff]',
  },
};

function SummaryCard({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: number | string;
  valueClassName: string;
}) {
  return (
    <div className="border-brand/10 flex h-full min-h-[112px] flex-col rounded-2xl border bg-white px-6 py-5">
      <p className="text-sm font-medium tracking-normal text-[#7f86b2]">{label}</p>
      <p
        className={`mt-3 text-4xl leading-none font-extrabold tracking-normal ${valueClassName}`}
      >
        {value}
      </p>
    </div>
  );
}

export default function WorkSummary({
  workspaceId,
  size = 'md',
}: {
  workspaceId: string;
  size?: WidgetSize;
}) {
  const tasksQuery = useTasksByWorkspaceId(workspaceId);
  const membersQuery = useWorkspaceMembersByWorkspaceId(workspaceId);

  if (tasksQuery.isError || membersQuery.isError) {
    return (
      <div className="border-brand/10 flex h-full min-h-[236px] flex-col items-start justify-center rounded-2xl border bg-white px-6 py-5">
        <p className="text-brand-ink text-[16px] font-semibold">업무 요약을 불러오지 못했습니다.</p>
        <button
          type="button"
          onClick={() => {
            void tasksQuery.refetch();
            void membersQuery.refetch();
          }}
          className="text-brand mt-4 rounded-full border border-[#d8dcff] px-3 py-1.5 text-[13px] font-semibold"
        >
          다시 시도
        </button>
      </div>
    );
  }

  const summary = createProgressChartSummary(tasksQuery.data ?? []);
  const taskSummaryValue = tasksQuery.isPending ? '-' : undefined;
  const memberCountValue = membersQuery.isPending ? '-' : undefined;

  const cards = [
    {
      key: 'total' as const,
      value: taskSummaryValue ?? summary.totalTaskCount,
    },
    {
      key: 'done' as const,
      value: taskSummaryValue ?? summary.doneTaskCount,
    },
    {
      key: 'in-progress' as const,
      value: taskSummaryValue ?? summary.inProgressTaskCount,
    },
    {
      key: 'members' as const,
      value: memberCountValue ?? (membersQuery.data ?? []).length,
    },
  ];

  return (
    <div className={`grid h-full gap-4 ${size === 'sm' ? 'grid-cols-1' : 'grid-cols-2'}`}>
      {cards.map(({ key, value }) => (
        <SummaryCard
          key={key}
          label={cardMeta[key].label}
          value={value}
          valueClassName={cardMeta[key].valueClassName}
        />
      ))}
    </div>
  );
}
