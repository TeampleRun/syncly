'use client';

// 하나의 워크스페이스 내부 페이지에서 공통으로 사용하는 상단 헤더입니다.
import { Bell, Search, UserRoundPlus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { mockCurrentWorkspaceMember } from '@/entities/workspace-member';
import type { WorkspaceNavigationItem } from '../model/workspace-navigation';

interface WorkspaceHeaderProps {
  navigationItems: WorkspaceNavigationItem[];
}

function getCurrentPageTitle(pathname: string, navigationItems: WorkspaceNavigationItem[]): string {
  const currentNavigationItem = navigationItems.find((item) => pathname.endsWith(`/${item.href}`));

  return currentNavigationItem?.label ?? '대시보드';
}

export function WorkspaceHeader({ navigationItems }: WorkspaceHeaderProps) {
  const pathname = usePathname();
  const title = getCurrentPageTitle(pathname, navigationItems);

  return (
    <header className="flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-8">
      <h1 className="text-lg font-bold text-slate-950">{title}</h1>

      <div className="flex items-center gap-3">
        <label className="flex h-10 w-60 items-center gap-2 rounded-2xl bg-slate-100 px-4 text-slate-400">
          <Search className="h-4 w-4" aria-hidden="true" />
          <input
            type="search"
            placeholder="검색..."
            className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
          />
        </label>

        <button
          type="button"
          className="flex h-10 items-center gap-2 rounded-2xl bg-indigo-600 px-4 text-sm font-bold text-white hover:bg-indigo-500"
        >
          <UserRoundPlus className="h-4 w-4" aria-hidden="true" />
          멤버 초대
        </button>

        <button
          type="button"
          aria-label="알림"
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500" />
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-400 text-sm font-bold text-white">
          {mockCurrentWorkspaceMember.avatarLabel}
        </div>
      </div>
    </header>
  );
}
