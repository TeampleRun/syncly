// 칸반 드래그앤드롭 훅 — 네이티브 HTML5 DnD의 보일러플레이트를 캡슐화한다.
// 컴포넌트는 카드에 dragProps(taskId), 컬럼에 dropProps(status)만 스프레드하면 된다.
// dragOverStatus로 "지금 드롭하면 들어갈 컬럼"을 알려, 컬럼에서 하이라이트를 그릴 수 있게 한다.
// 컬럼 내 재정렬은 하지 않고(디자인 요구 없음), 드롭 대상 컬럼의 상태로 이동만 시킨다.
import { useState, type DragEvent } from 'react';

import type { TaskStatus } from '@/entities/side-project/task';

export function useTaskDnd(onMove: (taskId: string, status: TaskStatus) => void) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  // 현재 드래그가 올라와 있는 컬럼(=드롭 시 들어갈 곳). 하이라이트 표시에 사용.
  const [dragOverStatus, setDragOverStatus] = useState<TaskStatus | null>(null);

  const reset = () => {
    setDraggingId(null);
    setDragOverStatus(null);
  };

  const dragProps = (taskId: string) => ({
    draggable: true,
    onDragStart: (event: DragEvent<HTMLElement>) => {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', taskId);
      setDraggingId(taskId);
    },
    onDragEnd: reset,
  });

  const dropProps = (status: TaskStatus) => ({
    onDragOver: (event: DragEvent<HTMLElement>) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      if (dragOverStatus !== status) setDragOverStatus(status);
    },
    onDrop: (event: DragEvent<HTMLElement>) => {
      event.preventDefault();
      const taskId = event.dataTransfer.getData('text/plain') || draggingId;
      if (taskId) onMove(taskId, status);
      reset();
    },
  });

  return { draggingId, dragOverStatus, dragProps, dropProps };
}
