'use client';

// 멤버 목록 — 아바타, 이름/이메일, 역할·상태 뱃지를 표시한다.
import {
  WORKSPACE_MEMBER_ROLE_META,
  WORKSPACE_MEMBER_STATUS_META,
  type WorkspaceMember,
} from '@/entities/workspace-member';
import { getAvatarColor } from '@/shared/lib/avatar-color';
import { Badge } from '@/shared/ui/badge';
import { cn } from '@/shared/lib/utils';

interface MemberListProps {
  members: WorkspaceMember[];
  currentUserId: string;
}

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
          {members.map((member) => {
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
                  style={{ backgroundColor: getAvatarColor(member.userId) }}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
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
