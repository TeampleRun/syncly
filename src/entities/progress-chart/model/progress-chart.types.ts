export interface ProgressChartStatusItem {
  id: 'done' | 'in-progress' | 'todo';
  label: string;
  count: number;
  color: string;
}

export interface ProgressChartAssigneeItem {
  name: string;
  count: number;
}

export interface ProgressChartSummary {
  totalTaskCount: number;
  doneTaskCount: number;
  inProgressTaskCount: number;
  overallProgressRate: number;
  assigneeItems: ProgressChartAssigneeItem[];
  statusItems: ProgressChartStatusItem[];
}
