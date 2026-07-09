'use client';

// 설정 페이지 셸 — 폰트/레이아웃을 잡고 URL 쿼리(?tab=) 기준으로 탭을 전환한다.
// 활성 탭은 서버에서 파싱해 prop으로 받는다(스프린트 보드와 동일한 URL 기반 패턴).
// 각 탭 내용은 feature 컴포넌트에 위임하고, 표시 데이터는 서버에서 주입받는다.
import Link from 'next/link';
import type { Workspace } from '@/entities/workspace';
import type { WorkspaceMember } from '@/entities/workspace-member';
import { WorkspaceInfoForm } from '@/features/manage-workspace-info';
import { MemberManagementPanel } from '@/features/manage-workspace-members';
import { MemberProfileForm } from '@/features/manage-member-profile';
import { plusJakartaSans } from '@/shared/lib/fonts';
import { cn } from '@/shared/lib/utils';
import { SETTINGS_TABS, type SettingsTabKey } from '../model/settings-tab';

interface SettingsViewProps {
  workspace: Workspace;
  workspaceId: string;
  activeTab: SettingsTabKey;
  members: WorkspaceMember[];
  currentUserId: string;
  currentNickname: string;
}

export function SettingsView({
  workspace,
  workspaceId,
  activeTab,
  members,
  currentUserId,
  currentNickname,
}: SettingsViewProps) {
  return (
    <div className={`${plusJakartaSans.className} mx-auto max-w-3xl`}>
      <h1 className="text-2xl font-bold text-slate-950">설정</h1>

      <nav className="mt-6 flex gap-6 border-b border-slate-200" aria-label="설정 탭">
        {SETTINGS_TABS.map((tab) => {
          const isActive = tab.key === activeTab;

          return (
            <Link
              key={tab.key}
              href={`?tab=${tab.key}`}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                '-mb-px border-b-2 pb-3 text-sm font-medium transition-colors',
                isActive
                  ? 'border-[var(--color-brand)] text-[var(--color-brand)]'
                  : 'border-transparent text-slate-500 hover:text-slate-800',
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6">
        {activeTab === 'workspace' && <WorkspaceInfoForm workspace={workspace} />}
        {activeTab === 'members' && (
          <MemberManagementPanel
            workspaceId={workspaceId}
            initialMembers={members}
            currentUserId={currentUserId}
          />
        )}
        {activeTab === 'profile' && <MemberProfileForm initialNickname={currentNickname} />}
      </div>
    </div>
  );
}
