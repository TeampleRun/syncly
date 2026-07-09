'use client';

// 팀원 관리 탭 패널 — 초대 섹션과 멤버 목록을 상태 훅으로 묶는다.
import { mockCurrentWorkspaceMember } from '@/entities/workspace-member';
import { useMemberManagement } from '../model/use-member-management';
import { MemberInviteSection } from './MemberInviteSection';
import { MemberList } from './MemberList';

interface MemberManagementPanelProps {
  workspaceId: string;
}

export function MemberManagementPanel({ workspaceId }: MemberManagementPanelProps) {
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
  } = useMemberManagement({ workspaceId });

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
      <MemberList members={members} currentUserId={mockCurrentWorkspaceMember.userId} />
    </div>
  );
}
