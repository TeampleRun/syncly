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
  return weekdayKeys[new Date(`${workDate}T00:00:00Z`).getUTCDay()];
}

export function getCurrentWeekRange(now = new Date()): { startDate: string; endDate: string } {
  const { year, month, day } = getKstDateParts(now);
  const currentDate = new Date(Date.UTC(year, month - 1, day));
  const mondayOffset = (currentDate.getUTCDay() + 6) % 7;
  const monday = new Date(currentDate);
  monday.setUTCDate(currentDate.getUTCDate() - mondayOffset);

  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);

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
  const date = new Date(`${startDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + weekdayIndex);

  return toDateString(date);
}

function toDateString(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getKstDateParts(date: Date): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const byType = new Map(parts.map((part) => [part.type, part.value]));

  return {
    year: Number(byType.get('year')),
    month: Number(byType.get('month')),
    day: Number(byType.get('day')),
  };
}
