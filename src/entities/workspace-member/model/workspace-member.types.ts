// Supabase 데이터가 연결되기 전까지 사용하는 목업 일정용 워크스페이스 멤버 형태입니다.
export type WorkspaceMemberRole = 'owner' | 'member';

// 워크스페이스 참여 상태: 초대를 수락해 참여 중이거나(joined), 초대만 발송된 상태(invited)입니다.
export type WorkspaceMemberStatus = 'joined' | 'invited';

export interface WorkspaceMember {
  workspaceId: string;
  userId: string;
  workspaceNickname: string;
  avatarLabel: string;
  email: string;
  role: WorkspaceMemberRole;
  status: WorkspaceMemberStatus;
}
