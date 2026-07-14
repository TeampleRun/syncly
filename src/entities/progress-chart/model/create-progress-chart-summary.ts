import type { Task, TaskStatus } from '@/entities/task';

import type {
  ProgressChartAssigneeItem,
  ProgressChartStatusItem,
  ProgressChartSummary,
} from './progress-chart.types';

const STATUS_META: Record<TaskStatus, Pick<ProgressChartStatusItem, 'label' | 'color'>> = {
  done: {
    label: '완료',
    color: '#574BEA',
  },
  'in-progress': {
    label: '진행 중',
    color: '#7D6AF3',
  },
  todo: {
    label: '대기',
    color: '#DED9FF',
  },
};

function toPercentage(value: number, total: number) {
  if (total === 0) {
    return 0;
  }

  return Math.round((value / total) * 1000) / 10;
}

function countByStatus(tasks: Task[], status: TaskStatus) {
  return tasks.filter((task) => task.status === status).length;
}

export function createProgressChartSummary(tasks: Task[]): ProgressChartSummary {
  const totalTaskCount = tasks.length;
  const doneTaskCount = countByStatus(tasks, 'done');
  const inProgressTaskCount = countByStatus(tasks, 'in-progress');
  const overallProgressRate = toPercentage(doneTaskCount, totalTaskCount);

  const assigneeMap = new Map<string, ProgressChartAssigneeItem>();
  tasks.forEach((task) => {
    const current = assigneeMap.get(task.assignee) ?? {
      name: task.assignee,
      count: 0,
    };

    current.count += 1;
    assigneeMap.set(task.assignee, current);
  });

  const assigneeItems = [...assigneeMap.values()].sort((left, right) => {
    if (right.count !== left.count) {
      return right.count - left.count;
    }

    return left.name.localeCompare(right.name, 'ko');
  });

  const statusItems: ProgressChartStatusItem[] = (
    Object.entries(STATUS_META) as Array<[TaskStatus, (typeof STATUS_META)[TaskStatus]]>
  ).map(([status, meta]) => ({
    id: status,
    label: meta.label,
    count: countByStatus(tasks, status),
    color: meta.color,
  }));

  return {
    totalTaskCount,
    doneTaskCount,
    inProgressTaskCount,
    overallProgressRate,
    assigneeItems,
    statusItems,
  };
}
