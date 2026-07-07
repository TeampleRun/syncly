// 스프린트 도메인 모델
export interface Sprint {
  name: string;
  period: string;
  daysLeft: number;
}

export interface VelocityPoint {
  sprint: string;
  planned: number;
  completed: number;
}

/** 벨로시티 차트 Y축 최댓값 */
export const VELOCITY_MAX = 60;
