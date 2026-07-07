// 일정(ScheduleEvent) 도메인 모델 + 오늘 일정 목데이터
export type ScheduleEventType = 'meeting' | 'deadline';

/** 일정 유형별 액센트 바 색상 (회의=보라 brand-end, 마감=빨강) */
export const SCHEDULE_TYPE_COLOR: Record<ScheduleEventType, string> = {
  meeting: '#8e51ff',
  deadline: '#fb2c36',
};

export interface ScheduleEvent {
  title: string;
  time: string;
  type: ScheduleEventType;
}

export const mockTodaySchedule: ScheduleEvent[] = [
  { title: '디자인 리뷰 회의', time: '11:00', type: 'meeting' },
  { title: '팀 점심', time: '12:30', type: 'meeting' },
  { title: '스프린트 데일리', time: '14:00', type: 'meeting' },
  { title: '코드 리뷰', time: '15:00', type: 'meeting' },
  { title: 'API 명세 마감', time: '16:00', type: 'deadline' },
  { title: '회고 준비', time: '17:00', type: 'meeting' },
];

/** 월간 캘린더 데이터 */
export interface CalendarMonth {
  year: number;
  /** 1-12 */
  month: number;
  /** 오늘 날짜(일). 해당 월이 아니면 null */
  today: number | null;
  /** 이벤트 점이 표시될 날짜(일) */
  eventDays: number[];
}

export const mockCalendar: CalendarMonth = {
  year: 2025,
  month: 7,
  today: 30,
  eventDays: [2, 5, 8, 10, 14, 22, 28],
};
