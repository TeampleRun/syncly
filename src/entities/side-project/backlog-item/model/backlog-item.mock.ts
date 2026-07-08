// 백로그 목데이터
import type { BacklogItem } from './backlog-item.types';

export const mockBacklog: BacklogItem[] = [
  { id: 'backlog-1', title: '소셜 피드 기능', point: 13, priority: 'high' },
  { id: 'backlog-2', title: '운동 친구 매칭', point: 8, priority: 'medium' },
  { id: 'backlog-3', title: '영상 가이드 연동', point: 13, priority: 'low' },
  { id: 'backlog-4', title: '다크모드 지원', point: 5, priority: 'low' },
];
