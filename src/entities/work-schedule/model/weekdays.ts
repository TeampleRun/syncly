// 첫 번째 근무 일정 목업에서 사용하는 요일 컬럼입니다.
export const weekdays = [
  { key: 'monday', label: '월' },
  { key: 'tuesday', label: '화' },
  { key: 'wednesday', label: '수' },
  { key: 'thursday', label: '목' },
  { key: 'friday', label: '금' },
  { key: 'saturday', label: '토' },
  { key: 'sunday', label: '일' },
] as const;

export type WeekdayKey = (typeof weekdays)[number]['key'];
