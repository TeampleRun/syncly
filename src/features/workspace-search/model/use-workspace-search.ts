'use client';

// 헤더 검색어를 debounce하고 Route Handler 결과를 TanStack Query 캐시로 관리합니다.
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchWorkspace, workspaceSearchQueryKey } from '@/entities/workspace-search';

const SEARCH_DEBOUNCE_MS = 300;

export function useWorkspaceSearch(workspaceId: string) {
  // 사용자가 즉시 입력하는 원본 검색어와 서버 요청에 쓰는 debounce 검색어를 분리합니다.
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedQuery(query.trim()), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timeoutId);
  }, [query]);

  const normalizedQuery = debouncedQuery.trim();
  const searchQuery = useQuery({
    queryKey: workspaceSearchQueryKey(workspaceId, normalizedQuery),
    queryFn: ({ signal }) => searchWorkspace({ workspaceId, query: normalizedQuery, signal }),
    enabled: normalizedQuery.length >= 2,
    staleTime: 30_000,
  });

  return {
    query,
    setQuery,
    normalizedQuery,
    results: searchQuery.data ?? [],
    isLoading:
      searchQuery.isPending || (query.trim().length >= 2 && query.trim() !== normalizedQuery),
    isError: searchQuery.isError,
  };
}
