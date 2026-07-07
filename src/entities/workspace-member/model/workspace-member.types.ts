// Supabase 데이터가 연결되기 전까지 사용하는 목업 일정용 워크스페이스 멤버 형태입니다.
export interface WorkspaceMember {
  workspaceId: string;
  userId: string;
  workspaceNickname: string;
  avatarLabel: string;
  role: 'owner' | 'member';
}
