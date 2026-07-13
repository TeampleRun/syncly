// 스프린트 보드 상태 훅 — 데이터는 react-query(부모 View)가 소유하고, 이 훅은 쓰기(뮤테이션)와 DnD만 배선한다.
// CRUD/상태이동은 서버액션·클라 update를 호출하고, 성공 시 쿼리 무효화로 재조회되어 목록이 갱신된다(재조회 방식, B-1).
// 낙관적 업데이트는 후속 과제(B-2). 실패는 각 뮤테이션 훅의 onError(toast)에서 노출된다.
import { useCallback } from 'react';

import {
  type Task,
  type TaskStatus,
  useCreateTask,
  useDeleteTask,
  useUpdateTask,
  useUpdateTaskSprint,
  useUpdateTaskStatus,
} from '@/entities/side-project/task';

import { groupTasksByStatus } from './sprint-board-columns';
import { toTaskInput, type TaskFormValues } from './task-form';
import { useTaskDnd } from './use-task-dnd';

interface UseSprintBoardParams {
  /** 새 업무를 편입할 현재 스프린트 id */
  sprintId: string;
  /** 새 업무가 속할 워크스페이스 id */
  workspaceId: string;
  /** 현재 스프린트 업무(react-query 데이터) */
  tasks: Task[];
  /** 백로그 업무(react-query 데이터) */
  backlog: Task[];
}

export function useSprintBoard({ sprintId, workspaceId, tasks, backlog }: UseSprintBoardParams) {
  const createMutation = useCreateTask(workspaceId);
  const updateMutation = useUpdateTask();
  const deleteMutation = useDeleteTask();
  const statusMutation = useUpdateTaskStatus();
  const sprintMutation = useUpdateTaskSprint();

  // 스프린트에 새 업무 추가(기본 상태: 대기)
  const addSprintTask = useCallback(
    (values: TaskFormValues) => createMutation.mutate({ input: toTaskInput(values), sprintId }),
    [createMutation, sprintId],
  );

  // 백로그에 새 항목 추가(스프린트 미편입)
  const addBacklogTask = useCallback(
    (values: TaskFormValues) =>
      createMutation.mutate({ input: toTaskInput(values), sprintId: null }),
    [createMutation],
  );

  // 수정/삭제는 업무가 어느 목록에 있든 id로 처리(스프린트·백로그 공통)
  const updateTask = useCallback(
    (id: string, values: TaskFormValues) =>
      updateMutation.mutate({ id, input: toTaskInput(values) }),
    [updateMutation],
  );

  const deleteTask = useCallback((id: string) => deleteMutation.mutate(id), [deleteMutation]);

  // 백로그 항목을 현재 스프린트로 편입(sprint_id = 현재 스프린트). status는 유지된다.
  const moveToSprint = useCallback(
    (id: string) => sprintMutation.mutate({ id, sprintId }),
    [sprintMutation, sprintId],
  );

  // 드래그로 컬럼(상태) 이동 — 스프린트 업무에만 적용
  const moveTask = useCallback(
    (id: string, status: TaskStatus) => statusMutation.mutate({ id, status }),
    [statusMutation],
  );

  const dnd = useTaskDnd(moveTask);
  const columns = groupTasksByStatus(tasks);

  return {
    columns,
    backlogTasks: backlog,
    addSprintTask,
    addBacklogTask,
    updateTask,
    deleteTask,
    moveToSprint,
    dragProps: dnd.dragProps,
    dropProps: dnd.dropProps,
    dragOverStatus: dnd.dragOverStatus,
  };
}
