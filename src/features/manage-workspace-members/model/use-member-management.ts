'use client';

// 팀원 초대(이메일/링크)와 멤버 목록 상태를 관리합니다.
// 백엔드 연동 전이므로 초대는 목록에 '초대됨' 상태의 멤버를 추가하는 목업으로 동작합니다.
import { useMemo, useState } from 'react';
import {
  getMockWorkspaceMembersByWorkspaceId,
  type WorkspaceMember,
} from '@/entities/workspace-member';

export type InviteMode = 'email' | 'link';

interface UseMemberManagementParams {
  workspaceId: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function createMemberId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `member-${crypto.randomUUID()}`;
  }

  return `member-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function toNickname(email: string) {
  return email.split('@')[0];
}

function toAvatarLabel(email: string) {
  return email.charAt(0).toUpperCase();
}

export function useMemberManagement({ workspaceId }: UseMemberManagementParams) {
  const [members, setMembers] = useState<WorkspaceMember[]>(() =>
    getMockWorkspaceMembersByWorkspaceId(workspaceId),
  );
  const [inviteMode, setInviteMode] = useState<InviteMode>('email');
  const [email, setEmail] = useState('');

  // 백엔드 연동 시 서버에서 발급한 초대 링크로 교체한다.
  const inviteLink = `https://syncly.app/invite/${workspaceId}`;

  const trimmedEmail = email.trim();
  const isDuplicate = useMemo(
    () => members.some((member) => member.email.toLowerCase() === trimmedEmail.toLowerCase()),
    [members, trimmedEmail],
  );
  const canInvite = EMAIL_PATTERN.test(trimmedEmail) && !isDuplicate;

  const inviteByEmail = () => {
    if (!canInvite) {
      return;
    }

    setMembers((previous) => [
      ...previous,
      {
        workspaceId,
        userId: createMemberId(),
        workspaceNickname: toNickname(trimmedEmail),
        avatarLabel: toAvatarLabel(trimmedEmail),
        email: trimmedEmail,
        role: 'member',
        status: 'invited',
      },
    ]);
    setEmail('');
  };

  return {
    members,
    inviteMode,
    setInviteMode,
    email,
    setEmail,
    inviteLink,
    canInvite,
    isDuplicate,
    inviteByEmail,
  };
}
