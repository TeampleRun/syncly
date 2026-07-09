'use client';

// 설정 페이지 셸 — 폰트/레이아웃을 잡고 URL 쿼리(?tab=) 기준으로 탭을 전환한다.
// 활성 탭은 서버에서 파싱해 prop으로 받는다(스프린트 보드와 동일한 URL 기반 패턴).
// 각 탭의 실제 내용은 이후 feature 컴포넌트로 채운다.
import Link from 'next/link';
import type { Workspace } from '@/entities/workspace';
import { WorkspaceInfoForm } from '@/features/manage-workspace-info';
import { plusJakartaSans } from '@/shared/lib/fonts';
import { cn } from '@/shared/lib/utils';
import { SETTINGS_TABS, type SettingsTabKey } from '../model/settings-tab';

interface SettingsViewProps {
  workspace: Workspace;
  workspaceId: string;
  activeTab: SettingsTabKey;
}

export function SettingsView({ workspace, workspaceId, activeTab }: SettingsViewProps) {
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
        {activeTab === 'members' && <SettingsTabPlaceholder label="팀원 관리" />}
        {activeTab === 'profile' && <SettingsTabPlaceholder label="프로필" />}
      </div>
    </div>
  );
}

// TODO(T4~T6): 각 탭을 feature 컴포넌트로 교체한다.
function SettingsTabPlaceholder({ label }: { label: string }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
      {label} 탭 (구현 예정)
    </section>
  );
}
