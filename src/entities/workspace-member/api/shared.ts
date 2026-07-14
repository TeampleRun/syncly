import type { WorkspaceMember } from '../model/workspace-member.types';

export interface WorkspaceMemberQueryRow {
  workspace_id: string;
  user_id: string;
  workspace_nickname: string;
  role: WorkspaceMember['role'];
  profile: {
    email: string;
    real_name: string;
  } | null;
}

export const workspaceMemberSelectQuery =
  'workspace_id, user_id, workspace_nickname, role, profile:profiles!workspace_members_user_id_fkey(email, real_name)';

export function mapWorkspaceMemberRows(rows: WorkspaceMemberQueryRow[]): WorkspaceMember[] {
  return rows.map((member) => ({
    workspaceId: member.workspace_id,
    userId: member.user_id,
    workspaceNickname: member.workspace_nickname,
    avatarLabel: member.profile?.real_name.slice(0, 1) ?? '?',
    email: member.profile?.email ?? '',
    role: member.role,
    // 현재 실데이터 스키마는 초대 대기 상태를 별도 컬럼으로 저장하지 않는다.
    // workspace_members row는 참여 확정 멤버만 의미하므로 joined로 노출한다.
    status: 'joined',
  }));
}
