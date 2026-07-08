// 스프린트 칸반 컬럼 — 상태 헤더(점 + 라벨 + 포인트 합계) + 업무 카드 목록 + 드롭 영역.
// 상태 점 색은 TASK_STATUS를 단일 출처로 사용한다. 카드 드래그/카드 액션은 상위에서 주입한다.
import type { DragEventHandler } from 'react';

import { TASK_STATUS, type Task } from '@/entities/side-project/task';

import type { SprintColumn as SprintColumnData } from '../model/sprint-board-columns';
import { TaskCard } from './TaskCard';

interface DropProps {
  onDragOver: DragEventHandler<HTMLElement>;
  onDrop: DragEventHandler<HTMLElement>;
}

interface DragProps {
  draggable: boolean;
  onDragStart: DragEventHandler<HTMLElement>;
  onDragEnd: DragEventHandler<HTMLElement>;
}

interface SprintColumnProps {
  column: SprintColumnData;
  /** 드래그가 이 컬럼 위에 올라와 있는지(드롭 대상 하이라이트) */
  isDragOver: boolean;
  /** 이 컬럼(상태)의 드롭 핸들러 */
  dropProps: DropProps;
  /** 카드 id별 드래그 핸들러 생성기 */
  getDragProps: (taskId: string) => DragProps;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export function SprintColumn({
  column,
  isDragOver,
  dropProps,
  getDragProps,
  onEditTask,
  onDeleteTask,
}: SprintColumnProps) {
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

      {/* 드롭 영역 — 빈 컬럼도 드롭받을 수 있도록 최소 높이를 준다.
          드래그가 올라오면 링/배경으로 "여기에 들어감"을 표시한다. */}
      <div
        {...dropProps}
        className={`flex min-h-[120px] flex-col gap-3 rounded-xl p-1 transition-colors ${
          isDragOver ? 'bg-brand/5 ring-brand/40 ring-2 ring-inset' : ''
        }`}
      >
        {column.tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={() => onEditTask(task)}
            onDelete={() => onDeleteTask(task.id)}
            {...getDragProps(task.id)}
          />
        ))}
        {column.tasks.length === 0 && (
          <p className="text-brand-muted py-8 text-center text-xs">업무 없음</p>
        )}
      </div>
    </div>
  );
}
