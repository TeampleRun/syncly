// 인증/멤버 API 연결 전 shell 푸터와 헤더에 표시하는 현재 멤버 목업입니다.
import type { WorkspaceMember } from './workspace-member.types';

export const mockCurrentWorkspaceMember: WorkspaceMember = {
  workspaceId: 'test',
  userId: 'user-1',
  workspaceNickname: '김민서',
  avatarLabel: '김',
  role: 'owner',
};
