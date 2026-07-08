// 스프린트 도메인 모델 — 스프린트 보드 화면의 애그리거트 루트.
// 현재 스프린트의 메타(기간·포인트)와 그 보드에 속한 업무 전체(tasks)를 소유한다.
import type { Task } from './task.types';

export interface Sprint {
  id: string;
  name: string;
  /** ISO 날짜 (YYYY-MM-DD) */
  startDate: string;
  endDate: string;
  daysLeft: number;
  /** 스프린트 계획 포인트 총합 */
  totalPoints: number;
  /** 완료 포인트 */
  completedPoints: number;
  /** 이 스프린트 보드의 업무 전체 (백로그 포함, status로 구분) */
  tasks: Task[];
}

export interface VelocityPoint {
  sprint: string;
  planned: number;
  completed: number;
}

/** 벨로시티 차트 Y축 최댓값 */
export const VELOCITY_MAX = 60;
