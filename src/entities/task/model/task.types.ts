export type TaskStatus = 'todo' | 'in-progress' | 'done';

export type Task = {
  id: string;
  workspaceId: string;
  title: string;
  assignee: string;
  assigneeInitial: string;
  assigneeColor: string;
  dueDate: string;
  status: TaskStatus;
};
