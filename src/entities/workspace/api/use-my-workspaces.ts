'use client';

// 내 워크스페이스 목록 쿼리 훅 — GET은 tanstack-query 컨벤션
import { useQuery } from '@tanstack/react-query';
import { DEV_USER_ID } from '@/shared/config/dev-user';
import { getMyWorkspaces } from './get-my-workspaces';

// 생성/수정 후 invalidateQueries({ queryKey: ['workspaces'] })로 무효화한다
export const myWorkspacesQueryKey = ['workspaces', 'my', DEV_USER_ID] as const;

export function useMyWorkspaces() {
  return useQuery({
    queryKey: myWorkspacesQueryKey,
    queryFn: getMyWorkspaces,
  });
}
