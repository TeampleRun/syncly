// 스프린트 목데이터 — 현재 스프린트 메타 + 보드 업무(칸반/백로그) + 벨로시티
import type { Sprint, VelocityPoint } from './sprint.types';
import type { Task } from './task.types';

// 스프린트 보드의 업무 전체. UI는 status로 칸반 컬럼(todo/in_progress/done)과 백로그(backlog)를 필터링한다.
const sprintTasks: Task[] = [
  // 대기 (todo) — 13pt
  {
    id: 'task-1',
    title: '온보딩 플로우 개선',
    point: 5,
    status: 'todo',
    priority: 'medium',
    category: 'design',
    assignee: { name: '최민준', avatarLabel: '최' },
  },
  {
    id: 'task-2',
    title: '성능 최적화 (Lighthouse)',
    point: 5,
    status: 'todo',
    priority: 'medium',
    category: 'frontend',
    assignee: { name: '박서준', avatarLabel: '박' },
  },
  {
    id: 'task-3',
    title: '베타 테스터 모집 공고',
    point: 3,
    status: 'todo',
    priority: 'medium',
    category: 'planning',
    assignee: { name: '김지은', avatarLabel: '김' },
  },
  // 진행 중 (in_progress) — 11pt
  {
    id: 'task-4',
    title: '운동 통계 차트',
    point: 8,
    status: 'in_progress',
    priority: 'medium',
    category: 'frontend',
    assignee: { name: '박서준', avatarLabel: '박' },
  },
  {
    id: 'task-5',
    title: '푸시 알림 설정',
    point: 3,
    status: 'in_progress',
    priority: 'medium',
    category: 'planning',
    assignee: { name: '김지은', avatarLabel: '김' },
  },
  // 완료 (done) — 18pt
  {
    id: 'task-6',
    title: '소셜 로그인 연동',
    point: 5,
    status: 'done',
    priority: 'medium',
    category: 'backend',
    assignee: { name: '이하은', avatarLabel: '이' },
  },
  {
    id: 'task-7',
    title: '운동 기록 CRUD API',
    point: 8,
    status: 'done',
    priority: 'medium',
    category: 'backend',
    assignee: { name: '이하은', avatarLabel: '이' },
  },
  {
    id: 'task-8',
    title: '홈 화면 UI 구현',
    point: 5,
    status: 'done',
    priority: 'medium',
    category: 'frontend',
    assignee: { name: '박서준', avatarLabel: '박' },
  },
  // 백로그 (backlog) — 카테고리·담당자 미지정
  {
    id: 'task-9',
    title: '소셜 피드 기능',
    point: 13,
    status: 'backlog',
    priority: 'high',
    category: null,
    assignee: null,
  },
  {
    id: 'task-10',
    title: '운동 친구 매칭',
    point: 8,
    status: 'backlog',
    priority: 'medium',
    category: null,
    assignee: null,
  },
  {
    id: 'task-11',
    title: '영상 가이드 연동',
    point: 13,
    status: 'backlog',
    priority: 'low',
    category: null,
    assignee: null,
  },
  {
    id: 'task-12',
    title: '다크모드 지원',
    point: 5,
    status: 'backlog',
    priority: 'low',
    category: null,
    assignee: null,
  },
];

export const currentSprint: Sprint = {
  id: 'sprint-2',
  name: 'Sprint 2',
  startDate: '2025-07-01',
  endDate: '2025-07-14',
  daysLeft: 8,
  totalPoints: 42,
  completedPoints: 28,
  tasks: sprintTasks,
};

/** 스프린트별 계획/완료 포인트 추이 */
export const sprintVelocity: VelocityPoint[] = [
  { sprint: 'S1', planned: 38, completed: 34 },
  { sprint: 'S2', planned: 42, completed: 28 },
];
