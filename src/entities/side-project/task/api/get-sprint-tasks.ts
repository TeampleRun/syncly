// 특정 스프린트에 편입된 업무 조회 — Mock 구현.
// 백엔드 준비 시 supabase.from('tasks').select().eq('sprint_id', sprintId) 로 교체한다.
// TODO(async): Supabase 전환 시 Promise 반환으로 바꾸고, 소비 위젯을 페칭 구조로 함께 옮긴다.
import type { Task } from '../model/task.types';
import { mockTasks } from './task.mock';

export function getSprintTasks(sprintId: string): Task[] {
  return mockTasks.filter((task) => task.sprintId === sprintId);
}
