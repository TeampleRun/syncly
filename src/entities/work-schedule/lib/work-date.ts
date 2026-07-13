// DB의 실제 work_date와 월~일 화면 열을 서로 변환하고, 현재 주의 조회 범위를 계산합니다.
import type { WeekdayKey } from '../model/weekdays';

const weekdayKeys: WeekdayKey[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

export function getWeekdayFromWorkDate(workDate: string): WeekdayKey {
  return weekdayKeys[new Date(`${workDate}T00:00:00`).getDay()];
}

export function getCurrentWeekRange(now = new Date()): { startDate: string; endDate: string } {
  const mondayOffset = (now.getDay() + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - mondayOffset);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    startDate: toDateString(monday),
    endDate: toDateString(sunday),
  };
}

export function getWorkDateByWeekday(startDate: string, weekday: WeekdayKey): string {
  const weekdayIndex = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ].indexOf(weekday);
  const date = new Date(`${startDate}T00:00:00`);
  date.setDate(date.getDate() + weekdayIndex);

  return toDateString(date);
}

function toDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
