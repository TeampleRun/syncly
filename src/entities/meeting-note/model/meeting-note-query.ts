// 회의록 목록 페이지와 최근 회의록 위젯이 동일한 워크스페이스 조회 결과를 공유하기 위한 Query 키입니다.
export const meetingNotesQueryKey = (workspaceId: string) =>
  ['meeting-notes', workspaceId] as const;
