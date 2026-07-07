// 워크스페이스별 설정이 저장되기 전까지 사용하는 기본 목업 근무 설정입니다.
import type { WorkScheduleConfig } from './work-schedule.types';

export const mockWorkScheduleConfig: WorkScheduleConfig = {
  shifts: [
    {
      id: 'shift-open',
      name: '오픈',
      startTime: '09:00',
      endTime: '14:00',
      color: 'sky',
      isOff: false,
    },
    {
      id: 'shift-middle',
      name: '미들',
      startTime: '14:00',
      endTime: '19:00',
      color: 'violet',
      isOff: false,
    },
    {
      id: 'shift-close',
      name: '마감',
      startTime: '19:00',
      endTime: '24:00',
      color: 'amber',
      isOff: false,
    },
    {
      id: 'shift-off',
      name: '휴무',
      startTime: null,
      endTime: null,
      color: 'slate',
      isOff: true,
    },
  ],
};
