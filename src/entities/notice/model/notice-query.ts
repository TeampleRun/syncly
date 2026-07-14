// 공지 화면과 대시보드 위젯이 동일한 서버 데이터를 공유하기 위한 TanStack Query 키입니다.
export const noticeBoardQueryKey = (workspaceId: string) => ['notice-board', workspaceId] as const;
