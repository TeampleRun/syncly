'use client';

// 팀원 초대(이메일/링크)와 멤버 목록 상태를 관리합니다.
// 멤버 목록은 서버(RSC)에서 조회해 initialMembers로 주입받고, 훅은 로컬 상태로 seed만 한다.
// 초대 링크는 서버에서 발급된 inviteCode와 런타임 origin으로 구성한다.
// 이메일 초대는 백엔드 미비로 아직 목록에 '초대됨' 멤버를 추가하는 목업으로 동작한다.
import { useMemo, useState, useSyncExternalStore } from 'react';
import type { WorkspaceMember } from '@/entities/workspace-member';

export type InviteMode = 'email' | 'link';

interface UseMemberManagementParams {
  workspaceId: string;
  initialMembers: WorkspaceMember[];
  inviteCode: string | null;
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

// origin은 클라이언트에서만 알 수 있는 값이라 useSyncExternalStore로 읽는다.
// 서버 스냅샷은 빈 문자열이라 하이드레이션 불일치가 발생하지 않고, origin은 변하지 않으므로 구독은 no-op이다.
const subscribeToOrigin = () => () => {};
const getOriginSnapshot = () => window.location.origin;
const getOriginServerSnapshot = () => '';

export function useMemberManagement({
  workspaceId,
  initialMembers,
  inviteCode,
}: UseMemberManagementParams) {
  const [members, setMembers] = useState<WorkspaceMember[]>(initialMembers);
  const [inviteMode, setInviteMode] = useState<InviteMode>('email');
  const [email, setEmail] = useState('');

  const origin = useSyncExternalStore(
    subscribeToOrigin,
    getOriginSnapshot,
    getOriginServerSnapshot,
  );

  // 서버에서 발급된 초대 코드와 런타임 origin으로 초대 링크를 구성한다.
  const inviteLink = inviteCode && origin ? `${origin}/invite/${inviteCode}` : '';

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
