import type { ProjectBoardColumn } from '@/entities/project-column';
import type { Task, TaskStatus } from '@/entities/task';

const projectBoardColumnConfig: Array<{
  id: TaskStatus;
  title: string;
  tone: ProjectBoardColumn['tone'];
}> = [
  { id: 'todo', title: '대기', tone: 'slate' },
  { id: 'in-progress', title: '진행 중', tone: 'brand' },
  { id: 'done', title: '완료', tone: 'green' },
];

export function createProjectBoardColumns(tasks: Task[]): ProjectBoardColumn[] {
  return projectBoardColumnConfig.map((column) => ({
    ...column,
    tasks: tasks.filter((task) => task.status === column.id),
  }));
}

export function flattenProjectBoardColumns(columns: ProjectBoardColumn[]): Task[] {
  return columns.flatMap((column) => column.tasks);
}
