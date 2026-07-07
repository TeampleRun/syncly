import type { ProjectBoardColumn } from '@/entities/project-column';

export const initialProjectBoard: ProjectBoardColumn[] = [
  {
    id: 'todo',
    title: '대기',
    tone: 'slate',
    tasks: [
      {
        id: 'task-1',
        title: '사용자 인터뷰 설문지 제작',
        assignee: '박서준',
        assigneeInitial: '박',
        assigneeColor: '#00C950',
        dueDate: '7/5',
        columnId: 'todo',
      },
      {
        id: 'task-2',
        title: 'DB 스키마 설계',
        assignee: '김지은',
        assigneeInitial: '김',
        assigneeColor: '#FE9A00',
        dueDate: '7/6',
        columnId: 'todo',
      },
      {
        id: 'task-3',
        title: '스프린트 1 회고 준비',
        assignee: '이하은',
        assigneeInitial: '이',
        assigneeColor: '#615FFF',
        dueDate: '7/10',
        columnId: 'todo',
      },
    ],
  },
  {
    id: 'in-progress',
    title: '진행 중',
    tone: 'brand',
    tasks: [
      {
        id: 'task-4',
        title: '와이어프레임 초안 작성',
        assignee: '김지은',
        assigneeInitial: '김',
        assigneeColor: '#00B8DB',
        dueDate: '7/3',
        columnId: 'in-progress',
      },
      {
        id: 'task-5',
        title: '랜딩 페이지 디자인',
        assignee: '최민준',
        assigneeInitial: '최',
        assigneeColor: '#2B7FFF',
        dueDate: '7/8',
        columnId: 'in-progress',
      },
    ],
  },
  {
    id: 'done',
    title: '완료',
    tone: 'green',
    tasks: [
      {
        id: 'task-6',
        title: 'API 명세서 문서화',
        assignee: '이하은',
        assigneeInitial: '이',
        assigneeColor: '#615FFF',
        dueDate: '7/2',
        columnId: 'done',
      },
      {
        id: 'task-7',
        title: '로고 시안 3종 작성',
        assignee: '박서준',
        assigneeInitial: '박',
        assigneeColor: '#FE9A00',
        dueDate: '6/30',
        columnId: 'done',
      },
    ],
  },
];
