// 스프린트 보드 칸반 컬럼 파생 로직 — 업무 목록을 상태(대기/진행 중/완료)별로 그룹핑한다.
// 컬럼별 포인트 합계까지 함께 계산해, 컬럼 헤더의 "13pt" 같은 표시에 그대로 쓴다.
// 상태 순서/라벨은 entities의 TASK_STATUS를 단일 출처로 삼는다.
import { type Task, type TaskStatus, TASK_STATUS } from '@/entities/side-project/task';

export interface SprintColumn {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  /** 컬럼에 속한 업무 포인트 합계 */
  totalPoints: number;
}

// 칸반 컬럼 노출 순서 (대기 → 진행 중 → 완료)
const COLUMN_ORDER: TaskStatus[] = ['todo', 'in_progress', 'done'];

export function groupTasksByStatus(tasks: Task[]): SprintColumn[] {
  return COLUMN_ORDER.map((status) => {
    const columnTasks = tasks.filter((task) => task.status === status);
    return {
      id: status,
      title: TASK_STATUS[status].label,
      tasks: columnTasks,
      totalPoints: columnTasks.reduce((sum, task) => sum + task.point, 0),
    };
  });
}
