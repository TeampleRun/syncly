// 업무(Task) 파생 셀렉터 — 목록에서 화면용 집계값을 계산한다.
import type { Task, TaskStatus } from './task.types';

/**
 * 상태별 업무 건수를 집계한다(진행률 차트의 상태 분포용).
 * 모든 상태 키를 항상 0으로 초기화해, 해당 상태가 없어도 키가 누락되지 않도록 한다.
 */
export function countByStatus(tasks: Task[]): Record<TaskStatus, number> {
  const counts: Record<TaskStatus, number> = { todo: 0, in_progress: 0, done: 0 };
  for (const task of tasks) {
    counts[task.status] += 1;
  }
  return counts;
}
