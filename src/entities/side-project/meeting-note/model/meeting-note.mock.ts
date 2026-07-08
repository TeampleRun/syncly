// 회의록 목데이터
import type { MeetingNote } from './meeting-note.types';

export const mockMeetingNotes: MeetingNote[] = [
  {
    id: 'note-1',
    title: 'Sprint 2 플래닝',
    date: '2025-07-01',
    summary: '스프린트 목표와 백로그 우선순위를 확정했습니다.',
  },
  {
    id: 'note-2',
    title: 'Sprint 1 회고',
    date: '2025-06-28',
    summary: '지난 스프린트의 성과와 개선점을 논의했습니다.',
  },
  {
    id: 'note-3',
    title: '디자인 시스템 논의',
    date: '2025-06-24',
    summary: '공통 컴포넌트와 디자인 토큰 구조를 정리했습니다.',
  },
  {
    id: 'note-4',
    title: 'API 명세 리뷰',
    date: '2025-06-20',
    summary: '엔드포인트 규격과 에러 응답 형식을 검토했습니다.',
  },
];
