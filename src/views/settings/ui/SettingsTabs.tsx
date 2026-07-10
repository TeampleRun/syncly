// 설정 페이지 탭 네비게이션 — URL 쿼리(?tab=) 기반으로 활성 탭을 표시한다.
import Link from 'next/link';
import { cn } from '@/shared/lib/utils';
import { SETTINGS_TABS, type SettingsTabKey } from '../model/settings-tab';

interface SettingsTabsProps {
  activeTab: SettingsTabKey;
}

export function SettingsTabs({ activeTab }: SettingsTabsProps) {
  return (
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
  );
}
