import type { Task, TaskStatus } from '@/entities/task';
import type {
  ProgressChartAssigneeItem,
  ProgressChartStatusItem,
  ProgressChartSummary,
} from '@/entities/progress-chart';

// 진행률 차트는 별도 목업 숫자를 두지 않고 프로젝트 관리 task 목록에서 직접 파생한다.
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

  return Math.round((value / total) * 100);
}

function countByStatus(tasks: Task[], status: TaskStatus) {
  return tasks.filter((task) => task.status === status).length;
}

export function createProgressChartSummary(tasks: Task[]): ProgressChartSummary {
  const totalTaskCount = tasks.length;
  const doneTaskCount = countByStatus(tasks, 'done');
  const inProgressTaskCount = countByStatus(tasks, 'in-progress');
  const overallProgressRate = toPercentage(doneTaskCount, totalTaskCount);

  // 담당자별 막대 차트는 "담당자가 가진 전체 업무 수"를 기준으로 집계한다.
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

  // 도넛 차트 범례도 task status 집계값을 그대로 사용한다.
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
