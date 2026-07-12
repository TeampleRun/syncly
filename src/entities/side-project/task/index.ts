// task 엔티티의 Public API — 업무(Task) 모델 + 조회 api
// Sprint와 독립된 슬라이스이며, sprintId로 스프린트를 참조한다(Task → Sprint 단방향).
export {
  TASK_STATUS,
  TASK_PRIORITY,
  TASK_CATEGORY,
  type Task,
  type TaskStatus,
  type TaskPriority,
  type TaskCategory,
  type TaskAssignee,
} from './model/task.types';
export { getBacklogTasks } from './api/get-backlog-tasks';
export { getSprintTasks } from './api/get-sprint-tasks';
export { backlogTasksQueryKey, useBacklogTasks } from './api/use-backlog-tasks';
export { sprintTasksQueryKey, useSprintTasks } from './api/use-sprint-tasks';
export { getMockBacklogTasks, getMockSprintTasks } from './model/task.mock';
export { countByStatus } from './model/task.selectors';
export { toTask } from './model/task.mapper';
export type { TaskRow, TaskWithAssigneeRow } from './model/task.db.types';
