// 헤더의 TanStack Query가 워크스페이스 통합 검색 Route Handler를 호출하는 클라이언트 API입니다.
import type { WorkspaceSearchResult } from '../model/workspace-search.types';

export async function searchWorkspace(input: {
  workspaceId: string;
  query: string;
  signal?: AbortSignal;
}): Promise<WorkspaceSearchResult[]> {
  const searchParams = new URLSearchParams({ q: input.query });
  const response = await fetch(`/api/workspaces/${input.workspaceId}/search?${searchParams}`, {
    signal: input.signal,
  });

  if (!response.ok) {
    throw new Error('검색 결과를 불러오지 못했습니다.');
  }

  const payload = (await response.json()) as { results: WorkspaceSearchResult[] };
  return payload.results;
}
