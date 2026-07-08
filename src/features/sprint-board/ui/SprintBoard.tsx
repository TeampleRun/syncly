'use client';

// 스프린트 보드 — 칸반(대기/진행 중/완료) + 백로그를 담는 상호작용 컨테이너.
// 목데이터를 로컬 상태로 seed하고, 업무 CRUD·드래그 이동을 여기서 관리한다(Epic E).
// (백엔드 전환 시 seed 소스만 서버 조회로 교체하면 되고, 상태 구조는 유지된다.)
import { useState } from 'react';

import { currentSprint } from '@/entities/side-project/sprint';
import { getBacklogTasks, getSprintTasks, type Task } from '@/entities/side-project/task';

import { groupTasksByStatus } from '../model/sprint-board-columns';
import { BacklogSection } from './BacklogSection';
import { SprintColumn } from './SprintColumn';

export function SprintBoard() {
  // 스프린트 편입 업무 — 목데이터 seed 후 로컬 상태로 관리(setter는 Epic E에서 사용).
  const [sprintTasks] = useState<Task[]>(() => getSprintTasks(currentSprint.id));
  // 백로그(스프린트 미편입) 업무
  const [backlogTasks] = useState<Task[]>(() => getBacklogTasks(currentSprint.workspaceId));

  // 상태별 컬럼 + 컬럼 포인트 합계 (Epic C에서 카드 렌더에 사용)
  const columns = groupTasksByStatus(sprintTasks);
console.log(columns)
  return (
    <div className="flex flex-col gap-6">
      {/* 칸반 보드 — 상태별 컬럼 */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {columns.map((column) => (
          <SprintColumn key={column.id} column={column} />
        ))}
      </section>

      {/* 백로그 섹션 */}
      <BacklogSection tasks={backlogTasks} />
    </div>
  );
}
