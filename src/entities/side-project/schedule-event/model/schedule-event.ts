// 일정(ScheduleEvent) 도메인 모델 + 오늘 일정 목데이터
export interface ScheduleEvent {
  title: string;
  time: string;
}

export const mockTodaySchedule: ScheduleEvent[] = [
  { title: '디자인 리뷰 회의', time: '11:00' },
  { title: '팀 점심', time: '12:30' },
  { title: '스프린트 데일리', time: '14:00' },
  { title: '코드 리뷰', time: '15:00' },
  { title: 'API 명세 마감', time: '16:00' },
  { title: '회고 준비', time: '17:00' },
];
