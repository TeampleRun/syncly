// 자료실 페이지와 관련 위젯이 동일한 워크스페이스 자료 목록을 공유하기 위한 Query 키입니다.
export const resourceLibraryQueryKey = (workspaceId: string) =>
  ['resource-library', workspaceId] as const;
