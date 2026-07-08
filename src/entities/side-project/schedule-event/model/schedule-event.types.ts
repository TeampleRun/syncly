// 일정(ScheduleEvent)·캘린더 도메인 모델 + 유형 색상
export type ScheduleEventType = 'meeting' | 'deadline';

/** 일정 유형별 액센트 바 색상 (회의=보라 brand-end, 마감=빨강) */
export const SCHEDULE_TYPE_COLOR: Record<ScheduleEventType, string> = {
  meeting: '#8e51ff',
  deadline: '#fb2c36',
};

export interface ScheduleEvent {
  id: string;
  title: string;
  time: string;
  type: ScheduleEventType;
}

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
