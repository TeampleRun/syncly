import type { WorkspaceMember } from './workspace-member.types';

// mock-member data, 실제 서버와 연동이 되면 수정될 예정
export const mockWorkspaceMembers: WorkspaceMember[] = [
  {
    workspaceId: 'store-workspace',
    userId: 'user-1',
    workspaceNickname: '김민서',
    avatarLabel: '김',
    role: 'owner',
  },
  {
    workspaceId: 'store-workspace',
    userId: 'user-2',
    workspaceNickname: '이준혁',
    avatarLabel: '이',
    role: 'member',
  },
  {
    workspaceId: 'store-workspace',
    userId: 'user-3',
    workspaceNickname: '박소연',
    avatarLabel: '박',
    role: 'member',
  },
  {
    workspaceId: 'store-workspace',
    userId: 'user-4',
    workspaceNickname: '최다은',
    avatarLabel: '최',
    role: 'member',
  },
  {
    workspaceId: 'store-workspace',
    userId: 'user-5',
    workspaceNickname: '정우진',
    avatarLabel: '정',
    role: 'member',
  },
  {
    workspaceId: 'store-workspace',
    userId: 'user-6',
    workspaceNickname: '이서영',
    avatarLabel: '이',
    role: 'member',
  },
];
