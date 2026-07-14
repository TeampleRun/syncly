// 공지 화면과 대시보드 위젯이 공통으로 사용하는 공지 조회 형태입니다.
export interface Notice {
  id: string;
  workspaceId: string;
  authorId: string | null;
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

// 현재 사용자의 공지 권한을 UI에서 판단하기 위해 서버가 함께 내려주는 최소 멤버 정보입니다.
export interface NoticeViewer {
  userId: string;
  role: 'owner' | 'member';
}

export interface NoticeBoardData {
  notices: Notice[];
  viewer: NoticeViewer | null;
}
