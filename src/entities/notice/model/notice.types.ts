// Supabase 공지 테이블 연결 전까지 화면 상태와 목업 데이터에서 공유하는 공지 형태입니다.
export interface Notice {
  id: string;
  workspaceId: string;
  title: string;
  content: string;
  authorName: string;
  createdAt: string;
  isPinned: boolean;
}

export interface NoticeFormValues {
  title: string;
  content: string;
}
