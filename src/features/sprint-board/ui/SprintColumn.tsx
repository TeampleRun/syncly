// 스프린트 칸반 컬럼 — 상태 헤더(점 + 라벨 + 포인트 합계) + 업무 카드 목록.
// 상태 점 색은 TASK_STATUS를 단일 출처로 사용한다. 빈 컬럼은 안내 문구를 표시한다.
import { TASK_STATUS, TaskCard } from '@/entities/side-project/task';

import type { SprintColumn as SprintColumnData } from '../model/sprint-board-columns';

export function SprintColumn({ column }: { column: SprintColumnData }) {
  const status = TASK_STATUS[column.id];

  return (
    <div className="flex flex-col">
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full" style={{ backgroundColor: status.dot }} />
          <span className="text-brand-ink text-sm font-bold">{column.title}</span>
        </div>
        <span className="text-brand-muted text-xs">{column.totalPoints}pt</span>
      </div>

      <div className="flex flex-col gap-3">
        {column.tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        {column.tasks.length === 0 && (
          <p className="text-brand-muted py-8 text-center text-xs">업무 없음</p>
        )}
      </div>
    </div>
  );
}
