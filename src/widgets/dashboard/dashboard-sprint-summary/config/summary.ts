// 스프린트 요약 위젯 목데이터 — 현재 스프린트 + 포인트 통계(계획/완료/남은)
export interface Sprint {
  name: string;
  period: string;
  daysLeft: number;
}

export interface DashboardStat {
  id: string;
  label: string;
  value: number;
  unit: string;
  /** 수치 강조 색상 (Figma 지정 색상) */
  color: string;
}

export const sprint: Sprint = {
  name: 'Sprint 2',
  period: '7/1 – 7/14',
  daysLeft: 8,
};

export const stats: DashboardStat[] = [
  { id: 'planned', label: '계획 포인트', value: 42, unit: 'pt', color: '#155dfc' },
  { id: 'done', label: '완료 포인트', value: 28, unit: 'pt', color: '#00a63e' },
  { id: 'remaining', label: '남은 포인트', value: 14, unit: 'pt', color: '#e17100' },
];
