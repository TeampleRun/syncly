import { getMockTasksByWorkspaceId, type TaskStatus } from '@/entities/task';
import { getMockWorkspaceMembersByWorkspaceId } from '@/entities/workspace-member';
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

function countByStatus(tasks: ReturnType<typeof getMockTasksByWorkspaceId>, status: TaskStatus) {
  return tasks.filter((task) => task.status === status).length;
}

function SummaryCard({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: number;
  valueClassName: string;
}) {
  return (
    <div className="border-brand/10 flex h-full min-h-[112px] flex-col rounded-2xl border bg-white px-6 py-5">
      <p className="text-[15px] font-medium tracking-[-0.03em] text-[#7f86b2]">{label}</p>
      <p
        className={`mt-3 text-[50px] leading-none font-extrabold tracking-[-0.06em] ${valueClassName}`}
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
  const tasks = getMockTasksByWorkspaceId(workspaceId, 'team-workspace');
  const members = getMockWorkspaceMembersByWorkspaceId(workspaceId);
  const totalCount = tasks.length;
  const doneCount = countByStatus(tasks, 'done');
  const inProgressCount = countByStatus(tasks, 'in-progress');
  const completionRate = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);

  const cards = [
    {
      key: 'total' as const,
      value: totalCount,
    },
    {
      key: 'done' as const,
      value: doneCount,
    },
    {
      key: 'in-progress' as const,
      value: inProgressCount,
    },
    {
      key: 'members' as const,
      value: members.length,
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
