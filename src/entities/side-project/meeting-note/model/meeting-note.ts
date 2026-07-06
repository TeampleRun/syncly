// 회의록(MeetingNote) 도메인 모델 + 목데이터
export interface MeetingNote {
  title: string;
  date: string;
}

export const mockMeetingNotes: MeetingNote[] = [
  { title: 'Sprint 2 플래닝', date: '2025-07-01' },
  { title: 'Sprint 1 회고', date: '2025-06-28' },
];
