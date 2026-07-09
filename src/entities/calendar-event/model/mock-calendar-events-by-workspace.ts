import type { CalendarEvent } from './calendar-event.types';

const mockCalendarEventsByWorkspaceId: Record<string, CalendarEvent[]> = {
  test: [
    {
      id: 'calendar-event-1',
      workspaceId: 'test',
      title: 'API 명세 마감',
      date: '2025-07-02',
      time: null,
      color: 'violet',
    },
    {
      id: 'calendar-event-2',
      workspaceId: 'test',
      title: '백로그 정리',
      date: '2025-07-02',
      time: '오후 1:00',
      color: 'blue',
    },
    {
      id: 'calendar-event-3',
      workspaceId: 'test',
      title: '와이어프레임',
      date: '2025-07-03',
      time: null,
      color: 'purple',
    },
    {
      id: 'calendar-event-4',
      workspaceId: 'test',
      title: '스프린트',
      date: '2025-07-03',
      time: null,
      color: 'blue',
    },
    {
      id: 'calendar-event-5',
      workspaceId: 'test',
      title: '사용자 리서치',
      date: '2025-07-05',
      time: null,
      color: 'blue',
    },
    {
      id: 'calendar-event-6',
      workspaceId: 'test',
      title: '회의 안건 정리',
      date: '2025-07-05',
      time: '오전 10:00',
      color: 'amber',
    },
    {
      id: 'calendar-event-7',
      workspaceId: 'test',
      title: '랜딩 디자인',
      date: '2025-07-08',
      time: null,
      color: 'violet',
    },
    {
      id: 'calendar-event-8',
      workspaceId: 'test',
      title: '카피 문구 검토',
      date: '2025-07-08',
      time: '오후 2:00',
      color: 'purple',
    },
    {
      id: 'calendar-event-9',
      workspaceId: 'test',
      title: 'MVP 완성',
      date: '2025-07-14',
      time: null,
      color: 'green',
    },
    {
      id: 'calendar-event-10',
      workspaceId: 'test',
      title: '중간 점검 회의',
      date: '2025-07-14',
      time: '오후 4:00',
      color: 'blue',
    },
    {
      id: 'calendar-event-11',
      workspaceId: 'test',
      title: 'QA 시작',
      date: '2025-07-22',
      time: null,
      color: 'coral',
    },
    {
      id: 'calendar-event-12',
      workspaceId: 'test',
      title: '버그 우선순위 정리',
      date: '2025-07-22',
      time: '오전 11:00',
      color: 'pink',
    },
    {
      id: 'calendar-event-13',
      workspaceId: 'test',
      title: '배포 준비',
      date: '2025-07-28',
      time: null,
      color: 'violet',
    },
    {
      id: 'calendar-event-14',
      workspaceId: 'test',
      title: '릴리즈 체크리스트',
      date: '2025-07-28',
      time: '오후 1:00',
      color: 'green',
    },
    {
      id: 'calendar-event-15',
      workspaceId: 'test',
      title: '최종 발표 리허설',
      date: '2025-07-30',
      time: '오후 3:00',
      color: 'violet',
    },
    {
      id: 'calendar-event-16',
      workspaceId: 'test',
      title: '발표 자료 검수',
      date: '2025-07-30',
      time: '오후 5:00',
      color: 'amber',
    },
  ],
};

export function getMockCalendarEventsByWorkspaceId(workspaceId: string): CalendarEvent[] {
  return (
    mockCalendarEventsByWorkspaceId[workspaceId]?.map((event) => ({
      ...event,
    })) ?? []
  );
}
