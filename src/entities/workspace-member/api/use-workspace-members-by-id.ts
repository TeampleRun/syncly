'use client';

import { useQuery } from '@tanstack/react-query';

import type { WorkspaceMember } from '../model/workspace-member.types';
import { getWorkspaceMembersByWorkspaceIdClient } from './get-workspace-members-by-id.client';

export const workspaceMembersByWorkspaceQueryKey = (workspaceId: string) =>
  ['workspace-members', 'workspace', workspaceId] as const;

// initialData를 넘기면 RSC에서 조회한 멤버로 첫 렌더를 채우고(SSR 유지), 이후에는 공유 캐시가 소유한다.
// 미지정 시 기존 동작(클라 조회)과 동일하다.
export function useWorkspaceMembersByWorkspaceId(
  workspaceId: string,
  initialData?: WorkspaceMember[],
) {
  return useQuery({
    queryKey: workspaceMembersByWorkspaceQueryKey(workspaceId),
    queryFn: () => getWorkspaceMembersByWorkspaceIdClient(workspaceId),
    initialData,
  });
}
