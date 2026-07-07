import type { Task } from './task.types';

const mockTasksByWorkspaceId: Record<string, Task[]> = {
  test: [
    {
      id: 'task-1',
      workspaceId: 'test',
      title: '사용자 인터뷰 설문지 제작',
      assignee: '박서준',
      assigneeInitial: '박',
      assigneeColor: '#00C950',
      dueDate: '7/5',
      status: 'todo',
    },
    {
      id: 'task-2',
      workspaceId: 'test',
      title: 'DB 스키마 설계',
      assignee: '김지은',
      assigneeInitial: '김',
      assigneeColor: '#FE9A00',
      dueDate: '7/6',
      status: 'todo',
    },
    {
      id: 'task-3',
      workspaceId: 'test',
      title: '스프린트 1 회고 준비',
      assignee: '이하은',
      assigneeInitial: '이',
      assigneeColor: '#615FFF',
      dueDate: '7/10',
      status: 'todo',
    },
    {
      id: 'task-4',
      workspaceId: 'test',
      title: '와이어프레임 초안 작성',
      assignee: '김지은',
      assigneeInitial: '김',
      assigneeColor: '#00B8DB',
      dueDate: '7/3',
      status: 'in-progress',
    },
    {
      id: 'task-5',
      workspaceId: 'test',
      title: '랜딩 페이지 디자인',
      assignee: '최민준',
      assigneeInitial: '최',
      assigneeColor: '#2B7FFF',
      dueDate: '7/8',
      status: 'in-progress',
    },
    {
      id: 'task-6',
      workspaceId: 'test',
      title: 'API 명세서 문서화',
      assignee: '이하은',
      assigneeInitial: '이',
      assigneeColor: '#615FFF',
      dueDate: '7/2',
      status: 'done',
    },
    {
      id: 'task-7',
      workspaceId: 'test',
      title: '로고 시안 3종 작성',
      assignee: '박서준',
      assigneeInitial: '박',
      assigneeColor: '#FE9A00',
      dueDate: '6/30',
      status: 'done',
    },
  ],
};

export function getMockTasksByWorkspaceId(workspaceId: string): Task[] {
  return mockTasksByWorkspaceId[workspaceId]?.map((task) => ({ ...task })) ?? [];
}
