'use client';

// 팀원 관리 탭 패널 — 초대 섹션과 멤버 목록을 상태 훅으로 묶는다.
// 멤버 목록/현재 사용자 식별자는 서버(RSC)에서 조회해 prop으로 주입받는다.
import type { WorkspaceMember } from '@/entities/workspace-member';
import { useMemberManagement } from '../model/use-member-management';
import { MemberInviteSection } from './MemberInviteSection';
import { MemberList } from './MemberList';

interface MemberManagementPanelProps {
  workspaceId: string;
  initialMembers: WorkspaceMember[];
  currentUserId: string;
  inviteCode: string | null;
  inviteEnabled: boolean;
}

export function MemberManagementPanel({
  workspaceId,
  initialMembers,
  currentUserId,
  inviteCode,
  inviteEnabled,
}: MemberManagementPanelProps) {
  const {
    members,
    inviteMode,
    setInviteMode,
    email,
    setEmail,
    inviteLink,
    canInvite,
    isDuplicate,
    inviteByEmail,
    isInviteEnabled,
    isTogglingInvite,
    toggleInviteEnabled,
  } = useMemberManagement({ workspaceId, initialMembers, inviteCode, inviteEnabled });

  // 초대 링크 활성화는 RLS상 소유자만 변경할 수 있어, 토글도 소유자에게만 허용한다.
  const canManageInvite =
    initialMembers.find((member) => member.userId === currentUserId)?.role === 'owner';

  return (
    <div className="space-y-6">
      <MemberInviteSection
        inviteMode={inviteMode}
        onChangeInviteMode={setInviteMode}
        email={email}
        onChangeEmail={setEmail}
        canInvite={canInvite}
        isDuplicate={isDuplicate}
        onInviteByEmail={inviteByEmail}
        inviteLink={inviteLink}
        isInviteEnabled={isInviteEnabled}
        isTogglingInvite={isTogglingInvite}
        onToggleInviteEnabled={toggleInviteEnabled}
        canManageInvite={canManageInvite}
      />
      <MemberList members={members} currentUserId={currentUserId} />
    </div>
  );
}
