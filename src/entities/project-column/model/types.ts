import type { ProjectTask } from '@/entities/project-task';

export type ProjectColumnTone = 'slate' | 'brand' | 'green';

export type ProjectBoardColumn = {
  id: string;
  title: string;
  tone: ProjectColumnTone;
  tasks: ProjectTask[];
};
