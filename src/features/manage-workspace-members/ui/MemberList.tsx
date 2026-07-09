'use client';

// 멤버 목록 — 아바타, 이름/이메일, 역할·상태 뱃지를 표시한다.
import {
  WORKSPACE_MEMBER_ROLE_META,
  WORKSPACE_MEMBER_STATUS_META,
  type WorkspaceMember,
} from '@/entities/workspace-member';
import { Badge } from '@/shared/ui/badge';
import { cn } from '@/shared/lib/utils';

interface MemberListProps {
  members: WorkspaceMember[];
  currentUserId: string;
}

// 아바타 배경 색상 팔레트 — 멤버 순서에 따라 순환 배정한다.
const AVATAR_COLORS = [
  'bg-orange-400',
  'bg-indigo-400',
  'bg-emerald-400',
  'bg-rose-400',
  'bg-sky-400',
  'bg-amber-400',
];

export function MemberList({ members, currentUserId }: MemberListProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-base font-bold text-slate-950">멤버 ({members.length})</h2>

      {members.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">
          아직 참여한 멤버가 없어요. 팀원을 초대해 보세요.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {members.map((member, index) => {
            const roleMeta = WORKSPACE_MEMBER_ROLE_META[member.role];
            const statusMeta = WORKSPACE_MEMBER_STATUS_META[member.status];
            const isCurrentUser = member.userId === currentUserId;

            return (
              <li
                key={member.userId}
                className={cn(
                  'flex items-center gap-4 rounded-2xl border p-4',
                  isCurrentUser ? 'border-indigo-200 bg-indigo-50/40' : 'border-slate-200',
                )}
              >
                <span
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white',
                    AVATAR_COLORS[index % AVATAR_COLORS.length],
                  )}
                  aria-hidden="true"
                >
                  {member.avatarLabel}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-900">
                    {member.workspaceNickname}
                  </p>
                  <p className="truncate text-sm text-slate-500">{member.email}</p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <Badge tone={roleMeta.tone}>{roleMeta.label}</Badge>
                  <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
