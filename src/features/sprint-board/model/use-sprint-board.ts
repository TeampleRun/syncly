// 스프린트 보드 상태 훅 — 서버에서 받은 초기 데이터를 로컬 상태로 seed하고,
// 이후 CRUD/드래그 이동을 낙관적으로 로컬에서 처리한다(재조회 없음).
// 실 API 전환 시: 각 액션 안에서 서버 저장을 호출하고, 실패 시 이전 상태로 롤백한다.
//   - 추가: 임시 카드를 먼저 그린 뒤, 서버가 준 실제 id로 교체
//   - 그 외: setState 뒤 저장 호출, 실패 시 prev로 복원
// 컴포넌트/DnD는 이 훅이 주는 값만 소비하므로, 위 교체 시에도 UI는 그대로 유지된다.
import { useCallback, useState } from 'react';

import { type Task, type TaskStatus } from '@/entities/side-project/task';

import { groupTasksByStatus } from './sprint-board-columns';
import { applyValuesToTask, createTaskFromValues, type TaskFormValues } from './task-form';
import { useTaskDnd } from './use-task-dnd';

interface UseSprintBoardParams {
  /** 새 업무를 편입할 현재 스프린트 id */
  sprintId: string;
  /** 새 업무가 속할 워크스페이스 id */
  workspaceId: string;
  initialTasks: Task[];
  initialBacklog: Task[];
}

export function useSprintBoard({
  sprintId,
  workspaceId,
  initialTasks,
  initialBacklog,
}: UseSprintBoardParams) {
  // 서버에서 받은 초기 데이터로 seed
  const [sprintTasks, setSprintTasks] = useState<Task[]>(initialTasks);
  const [backlogTasks, setBacklogTasks] = useState<Task[]>(initialBacklog);

  // 스프린트에 새 업무 추가(기본 상태: 대기)
  const addSprintTask = useCallback(
    (values: TaskFormValues) => {
      setSprintTasks((prev) => [
        ...prev,
        createTaskFromValues(values, { workspaceId, sprintId, status: 'todo' }),
      ]);
    },
    [workspaceId, sprintId],
  );

  // 백로그에 새 항목 추가(스프린트 미편입)
  const addBacklogTask = useCallback(
    (values: TaskFormValues) => {
      setBacklogTasks((prev) => [
        ...prev,
        createTaskFromValues(values, { workspaceId, sprintId: null, status: 'todo' }),
      ]);
    },
    [workspaceId],
  );

  // 수정/삭제는 업무가 어느 목록에 있든 처리(스프린트·백로그 공통)
  const updateTask = useCallback((id: string, values: TaskFormValues) => {
    const patch = (list: Task[]) =>
      list.map((t) => (t.id === id ? applyValuesToTask(t, values) : t));
    setSprintTasks(patch);
    setBacklogTasks(patch);
  }, []);

  const deleteTask = useCallback((id: string) => {
    const remove = (list: Task[]) => list.filter((t) => t.id !== id);
    setSprintTasks(remove);
    setBacklogTasks(remove);
  }, []);

  // 드래그로 컬럼(상태) 이동 — 스프린트 업무에만 적용
  const moveTask = useCallback((id: string, status: TaskStatus) => {
    setSprintTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  }, []);

  const dnd = useTaskDnd(moveTask);
  const columns = groupTasksByStatus(sprintTasks);

  return {
    columns,
    backlogTasks,
    addSprintTask,
    addBacklogTask,
    updateTask,
    deleteTask,
    dragProps: dnd.dragProps,
    dropProps: dnd.dropProps,
    dragOverStatus: dnd.dragOverStatus,
  };
}
