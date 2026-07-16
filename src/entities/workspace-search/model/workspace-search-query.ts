// 워크스페이스와 검색어별로 결과 캐시를 분리하기 위한 TanStack Query 키입니다.
export const workspaceSearchQueryKey = (workspaceId: string, query: string) =>
  ['workspace-search', workspaceId, query] as const;
