// 대시보드 등 아직 DB 조회로 전환되지 않은 화면에서 사용하는 기본 근무유형 목업 설정입니다.
import type { WorkScheduleConfig } from './work-schedule.types';

export const mockWorkScheduleConfig: WorkScheduleConfig = {
  shifts: [
    {
      id: 'shift-open',
      code: 'open',
      name: '오픈',
      startTime: '09:00',
      endTime: '14:00',
      endsNextDay: false,
      color: 'sky',
      isOff: false,
    },
    {
      id: 'shift-middle',
      code: 'middle',
      name: '미들',
      startTime: '14:00',
      endTime: '19:00',
      endsNextDay: false,
      color: 'violet',
      isOff: false,
    },
    {
      id: 'shift-close',
      code: 'close',
      name: '마감',
      startTime: '19:00',
      endTime: '00:00',
      endsNextDay: true,
      color: 'amber',
      isOff: false,
    },
    {
      id: 'shift-off',
      code: 'off',
      name: '휴무',
      startTime: null,
      endTime: null,
      endsNextDay: false,
      color: 'slate',
      isOff: true,
    },
  ],
};
