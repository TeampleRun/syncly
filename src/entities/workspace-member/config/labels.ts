// 멤버의 역할/참여 상태를 UI에 표시하기 위한 한글 라벨과 뱃지 톤 매핑입니다.
import type { WorkspaceMemberRole, WorkspaceMemberStatus } from '../model/workspace-member.types';

// Badge 컴포넌트의 tone 값과 일치시킵니다.
export type BadgeTone = 'brand' | 'neutral' | 'success' | 'warning';

export const WORKSPACE_MEMBER_ROLE_META: Record<
  WorkspaceMemberRole,
  { label: string; tone: BadgeTone }
> = {
  owner: { label: '팀장', tone: 'brand' },
  member: { label: '팀원', tone: 'neutral' },
};

export const WORKSPACE_MEMBER_STATUS_META: Record<
  WorkspaceMemberStatus,
  { label: string; tone: BadgeTone }
> = {
  joined: { label: '참여 중', tone: 'success' },
  invited: { label: '초대됨', tone: 'warning' },
};
