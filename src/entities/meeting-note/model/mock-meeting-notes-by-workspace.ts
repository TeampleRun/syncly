import type { MeetingNote } from './meeting-note.types';

const mockMeetingNotesByWorkspaceId: Record<string, MeetingNote[]> = {
  test: [
    {
      id: 'meeting-note-1',
      workspaceId: 'test',
      authorId: null,
      title: '스프린트 1 킥오프',
      meetingDate: '2025-06-25',
      participants: [
        { id: 'participant-1', name: '김지은', initial: '김', color: '#FE9A00' },
        { id: 'participant-2', name: '박서준', initial: '박', color: '#00C950' },
        { id: 'participant-3', name: '이하은', initial: '이', color: '#615FFF' },
        { id: 'participant-4', name: '최민준', initial: '최', color: '#2B7FFF' },
      ],
      decisions: ['칸반 보드 도입 확정', '주 2회 데일리 스탠드업 진행'],
      followUpActions: ['칸반 보드 초기 세팅 (담당: 김지은)'],
    },
    {
      id: 'meeting-note-2',
      workspaceId: 'test',
      authorId: null,
      title: '디자인 시스템 논의',
      meetingDate: '2025-06-20',
      participants: [
        { id: 'participant-1', name: '김지은', initial: '김', color: '#FE9A00' },
        { id: 'participant-2', name: '박서준', initial: '박', color: '#00C950' },
      ],
      decisions: ['공통 버튼 규격 확정', '입력 필드와 카드 radius 통일'],
      followUpActions: ['공통 컴포넌트 분리', '디자인 토큰 정리'],
    },
  ],
};

export function getMockMeetingNotesByWorkspaceId(workspaceId: string): MeetingNote[] {
  return (
    mockMeetingNotesByWorkspaceId[workspaceId]?.map((meetingNote) => ({
      ...meetingNote,
      participants: meetingNote.participants.map((participant) => ({ ...participant })),
      decisions: [...meetingNote.decisions],
      followUpActions: [...meetingNote.followUpActions],
    })) ?? []
  );
}
