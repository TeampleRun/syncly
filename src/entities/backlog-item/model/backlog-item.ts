// 백로그 항목(BacklogItem) 도메인 모델 + 우선순위 색상 + 목데이터
export type BacklogPriority = 'high' | 'medium' | 'low';

/** 우선순위 표시 점 색상 (Figma 지정) */
export const BACKLOG_PRIORITY_COLOR: Record<BacklogPriority, string> = {
  high: '#ff6467',
  medium: '#ffb900',
  low: '#d1d5dc',
};

export interface BacklogItem {
  title: string;
  point: number;
  priority: BacklogPriority;
}

export const mockBacklog: BacklogItem[] = [
  { title: '소셜 피드 기능', point: 13, priority: 'high' },
  { title: '운동 친구 매칭', point: 8, priority: 'medium' },
  { title: '영상 가이드 연동', point: 13, priority: 'low' },
  { title: '다크모드 지원', point: 5, priority: 'low' },
];
