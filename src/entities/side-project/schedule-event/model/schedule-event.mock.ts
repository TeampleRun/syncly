// 오늘 일정·월간 캘린더 목데이터
import type { CalendarMonth, ScheduleEvent } from './schedule-event.types';

export const mockTodaySchedule: ScheduleEvent[] = [
  { title: '디자인 리뷰 회의', time: '11:00', type: 'meeting' },
  { title: '팀 점심', time: '12:30', type: 'meeting' },
  { title: '스프린트 데일리', time: '14:00', type: 'meeting' },
  { title: '코드 리뷰', time: '15:00', type: 'meeting' },
  { title: 'API 명세 마감', time: '16:00', type: 'deadline' },
  { title: '회고 준비', time: '17:00', type: 'meeting' },
];

export const mockCalendar: CalendarMonth = {
  year: 2025,
  month: 7,
  today: 30,
  eventDays: [2, 5, 8, 10, 14, 22, 28],
};
