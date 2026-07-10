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
export { countByStatus } from './model/task.selectors';
