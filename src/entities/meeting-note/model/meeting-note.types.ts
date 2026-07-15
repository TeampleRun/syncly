export interface MeetingNoteParticipant {
  id: string;
  name: string;
  initial: string;
  color: string;
}

export interface MeetingNote {
  id: string;
  workspaceId: string;
  // 작성자 프로필이 삭제되면 author_id가 null이 될 수 있어(on delete set null) 옵셔널로 둔다.
  authorId: string | null;
  title: string;
  // UI 표기에 사용하는 KST 기준 날짜(YYYY-MM-DD). DB의 meeting_at(timestamptz)에서 변환한다.
  meetingDate: string;
  participants: MeetingNoteParticipant[];
  decisions: string[];
  followUpActions: string[];
}

export interface MeetingNoteFormValues {
  title: string;
  meetingDate: string;
  decisions: string;
  followUpActions: string;
}
