import type { Task, TaskStatus } from '@/entities/task';

export type ProjectColumnTone = 'slate' | 'brand' | 'green';

export type ProjectBoardColumn = {
  id: TaskStatus;
  title: string;
  tone: ProjectColumnTone;
  tasks: Task[];
};
