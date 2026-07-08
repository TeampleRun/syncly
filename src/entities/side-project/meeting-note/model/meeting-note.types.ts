// 회의록(MeetingNote) 도메인 모델
export interface MeetingNote {
  id: string;
  title: string;
  date: string;
  /** 본문 요약(미리보기) */
  summary: string;
}
