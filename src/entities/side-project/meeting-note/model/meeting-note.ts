// 회의록(MeetingNote) 도메인 모델 + 목데이터
export interface MeetingNote {
  title: string;
  date: string;
  /** 본문 요약(미리보기) */
  summary: string;
}

export const mockMeetingNotes: MeetingNote[] = [
  {
    title: 'Sprint 2 플래닝',
    date: '2025-07-01',
    summary: '스프린트 목표와 백로그 우선순위를 확정했습니다.',
  },
  {
    title: 'Sprint 1 회고',
    date: '2025-06-28',
    summary: '지난 스프린트의 성과와 개선점을 논의했습니다.',
  },
  {
    title: '디자인 시스템 논의',
    date: '2025-06-24',
    summary: '공통 컴포넌트와 디자인 토큰 구조를 정리했습니다.',
  },
  {
    title: 'API 명세 리뷰',
    date: '2025-06-20',
    summary: '엔드포인트 규격과 에러 응답 형식을 검토했습니다.',
  },
];
