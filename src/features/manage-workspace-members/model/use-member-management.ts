'use client';

// 팀원 초대(이메일/링크)와 멤버 목록 상태를 관리합니다.
// 멤버 목록은 서버(RSC)에서 조회해 initialMembers로 주입받는다.
// 초대 링크는 서버에서 발급된 inviteCode와 런타임 origin으로 구성한다.
// 이메일 초대는 입력한 주소로 초대 링크가 담긴 메일을 발송한다(sendInviteEmail).
import { useMemo, useState, useSyncExternalStore } from 'react';
import { toast } from 'sonner';
import { sendInviteEmail, setWorkspaceInviteEnabled } from '@/entities/workspace';
import type { WorkspaceMember } from '@/entities/workspace-member';

export type InviteMode = 'email' | 'link';

interface UseMemberManagementParams {
  workspaceId: string;
  initialMembers: WorkspaceMember[];
  inviteCode: string | null;
  inviteEnabled: boolean;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// origin은 클라이언트에서만 알 수 있는 값이라 useSyncExternalStore로 읽는다.
// 서버 스냅샷은 빈 문자열이라 하이드레이션 불일치가 발생하지 않고, origin은 변하지 않으므로 구독은 no-op이다.
const subscribeToOrigin = () => () => {};
const getOriginSnapshot = () => window.location.origin;
const getOriginServerSnapshot = () => '';

export function useMemberManagement({
  workspaceId,
  initialMembers,
  inviteCode,
  inviteEnabled,
}: UseMemberManagementParams) {
  const [members] = useState<WorkspaceMember[]>(initialMembers);
  const [inviteMode, setInviteMode] = useState<InviteMode>('email');
  const [email, setEmail] = useState('');
  const [isSendingInvite, setIsSendingInvite] = useState(false);

  // 초대 링크 활성 여부는 서버값으로 seed하고, 토글은 낙관적으로 반영 후 실패 시 롤백한다.
  const [isInviteEnabled, setIsInviteEnabled] = useState(inviteEnabled);
  const [isTogglingInvite, setIsTogglingInvite] = useState(false);

  const toggleInviteEnabled = async () => {
    if (isTogglingInvite) {
      return;
    }

    const next = !isInviteEnabled;
    setIsInviteEnabled(next);
    setIsTogglingInvite(true);
    try {
      await setWorkspaceInviteEnabled({ workspaceId, enabled: next });
    } catch (error) {
      // 실패 시 이전 상태로 롤백한다.
      setIsInviteEnabled(!next);
      console.error(error);
      toast.error(
        error instanceof Error
          ? error.message
          : '초대 링크 설정 변경에 실패했습니다. 잠시 후 다시 시도해주세요.',
      );
    } finally {
      setIsTogglingInvite(false);
    }
  };

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
  const canInvite = EMAIL_PATTERN.test(trimmedEmail) && !isDuplicate && !isSendingInvite;

  const inviteByEmail = async () => {
    if (!canInvite) {
      return;
    }

    setIsSendingInvite(true);
    try {
      await sendInviteEmail({ workspaceId, email: trimmedEmail });
      toast.success('초대 메일을 보냈어요.');
      setEmail('');
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error
          ? error.message
          : '초대 메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.',
      );
    } finally {
      setIsSendingInvite(false);
    }
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
    isSendingInvite,
    isInviteEnabled,
    isTogglingInvite,
    toggleInviteEnabled,
  };
}
