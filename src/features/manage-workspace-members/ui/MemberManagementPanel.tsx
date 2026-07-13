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
}

export function MemberManagementPanel({
  workspaceId,
  initialMembers,
  currentUserId,
  inviteCode,
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
  } = useMemberManagement({ workspaceId, initialMembers, inviteCode });

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
      />
      <MemberList members={members} currentUserId={currentUserId} />
    </div>
  );
}
