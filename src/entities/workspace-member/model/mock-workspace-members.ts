import type { WorkspaceMember } from './workspace-member.types';

// mock-member data, 실제 서버와 연동이 되면 수정될 예정
export const mockWorkspaceMembers: WorkspaceMember[] = [
  {
    workspaceId: 'test',
    userId: 'user-1',
    workspaceNickname: '김지은',
    avatarLabel: '김',
    email: 'jieun@example.com',
    role: 'owner',
    status: 'joined',
  },
  {
    workspaceId: 'test',
    userId: 'user-2',
    workspaceNickname: '박서준',
    avatarLabel: '박',
    email: 'seojun@example.com',
    role: 'member',
    status: 'joined',
  },
  {
    workspaceId: 'test',
    userId: 'user-3',
    workspaceNickname: '이하은',
    avatarLabel: '이',
    email: 'haeun@example.com',
    role: 'member',
    status: 'joined',
  },
  {
    workspaceId: 'test',
    userId: 'user-4',
    workspaceNickname: '최민준',
    avatarLabel: '최',
    email: 'minjun@example.com',
    role: 'member',
    status: 'invited',
  },
  {
    workspaceId: 'store-workspace',
    userId: 'user-1',
    workspaceNickname: '김민서',
    avatarLabel: '김',
    email: 'minseo@example.com',
    role: 'owner',
    status: 'joined',
  },
  {
    workspaceId: 'store-workspace',
    userId: 'user-2',
    workspaceNickname: '이준혁',
    avatarLabel: '이',
    email: 'junhyeok@example.com',
    role: 'member',
    status: 'joined',
  },
  {
    workspaceId: 'store-workspace',
    userId: 'user-3',
    workspaceNickname: '박소연',
    avatarLabel: '박',
    email: 'soyeon@example.com',
    role: 'member',
    status: 'invited',
  },
  {
    workspaceId: 'store-workspace',
    userId: 'user-4',
    workspaceNickname: '최다은',
    avatarLabel: '최',
    email: 'daeun@example.com',
    role: 'member',
    status: 'joined',
  },
  {
    workspaceId: 'store-workspace',
    userId: 'user-5',
    workspaceNickname: '정우진',
    avatarLabel: '정',
    email: 'woojin@example.com',
    role: 'member',
    status: 'joined',
  },
  {
    workspaceId: 'store-workspace',
    userId: 'user-6',
    workspaceNickname: '이서영',
    avatarLabel: '이',
    email: 'seoyeong@example.com',
    role: 'member',
    status: 'invited',
  },
];

export function getMockWorkspaceMembersByWorkspaceId(workspaceId: string): WorkspaceMember[] {
  return mockWorkspaceMembers.filter((member) => member.workspaceId === workspaceId);
}
