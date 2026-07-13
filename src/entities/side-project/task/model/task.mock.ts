// 업무(Task) 목데이터 — api 세그먼트가 소비하는 가짜 서버 데이터.
// 백엔드 준비 시 이 배열 대신 tasks 테이블 조회로 교체된다(get-*-tasks.ts).
// 스프린트 편입 업무는 sprintId = currentSprint.id, 백로그는 sprintId = null.
// Task → Sprint 방향의 의도된 교차 참조(FK 방향과 일치, 비순환): 목 id를 sprint 슬라이스와 동기화한다.
import { currentSprint, SIDE_PROJECT_WORKSPACE_ID } from '@/entities/side-project/sprint';

import type { Task } from './task.types';

const workspaceId = SIDE_PROJECT_WORKSPACE_ID;
const sprintId = currentSprint.id;

export const mockTasks: Task[] = [
  // 스프린트 편입 · 대기 (todo) — 13pt
  {
    id: 'task-1',
    workspaceId,
    sprintId,
    title: '온보딩 플로우 개선',
    point: 5,
    status: 'todo',
    priority: 'medium',
    category: 'design',
    assigneeId: 'mock-user-choi',
  },
  {
    id: 'task-2',
    workspaceId,
    sprintId,
    title: '성능 최적화 (Lighthouse)',
    point: 5,
    status: 'todo',
    priority: 'medium',
    category: 'frontend',
    assigneeId: 'mock-user-park',
  },
  {
    id: 'task-3',
    workspaceId,
    sprintId,
    title: '베타 테스터 모집 공고',
    point: 3,
    status: 'todo',
    priority: 'medium',
    category: 'planning',
    assigneeId: 'mock-user-kim',
  },
  // 스프린트 편입 · 진행 중 (in_progress) — 11pt
  {
    id: 'task-4',
    workspaceId,
    sprintId,
    title: '운동 통계 차트',
    point: 8,
    status: 'in_progress',
    priority: 'medium',
    category: 'frontend',
    assigneeId: 'mock-user-park',
  },
  {
    id: 'task-5',
    workspaceId,
    sprintId,
    title: '푸시 알림 설정',
    point: 3,
    status: 'in_progress',
    priority: 'medium',
    category: 'planning',
    assigneeId: 'mock-user-kim',
  },
  // 스프린트 편입 · 완료 (done) — 18pt
  {
    id: 'task-6',
    workspaceId,
    sprintId,
    title: '소셜 로그인 연동',
    point: 5,
    status: 'done',
    priority: 'medium',
    category: 'backend',
    assigneeId: 'mock-user-lee',
  },
  {
    id: 'task-7',
    workspaceId,
    sprintId,
    title: '운동 기록 CRUD API',
    point: 8,
    status: 'done',
    priority: 'medium',
    category: 'backend',
    assigneeId: 'mock-user-lee',
  },
  {
    id: 'task-8',
    workspaceId,
    sprintId,
    title: '홈 화면 UI 구현',
    point: 5,
    status: 'done',
    priority: 'medium',
    category: 'frontend',
    assigneeId: 'mock-user-park',
  },
  // 백로그 (sprintId: null) — 카테고리·담당자 미지정, status는 대기(todo)
  {
    id: 'task-9',
    workspaceId,
    sprintId: null,
    title: '소셜 피드 기능',
    point: 13,
    status: 'todo',
    priority: 'high',
    category: null,
    assigneeId: null,
  },
  {
    id: 'task-10',
    workspaceId,
    sprintId: null,
    title: '운동 친구 매칭',
    point: 8,
    status: 'todo',
    priority: 'medium',
    category: null,
    assigneeId: null,
  },
  {
    id: 'task-11',
    workspaceId,
    sprintId: null,
    title: '영상 가이드 연동',
    point: 13,
    status: 'todo',
    priority: 'low',
    category: null,
    assigneeId: null,
  },
  {
    id: 'task-12',
    workspaceId,
    sprintId: null,
    title: '다크모드 지원',
    point: 5,
    status: 'todo',
    priority: 'low',
    category: null,
    assigneeId: null,
  },
];

// 대시보드 위젯 전용 동기 mock 접근자 — api/get-*-tasks.ts가 async(Supabase)로 전환되어 분리한다.
// 대시보드 실 연동 시 이 접근자와 mock 데이터를 함께 제거한다.
export function getMockSprintTasks(sprintId: string): Task[] {
  return mockTasks.filter((task) => task.sprintId === sprintId);
}

export function getMockBacklogTasks(workspaceId: string): Task[] {
  return mockTasks.filter((task) => task.workspaceId === workspaceId && task.sprintId === null);
}
