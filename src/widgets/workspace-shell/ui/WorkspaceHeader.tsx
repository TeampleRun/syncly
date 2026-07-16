'use client';

// 하나의 워크스페이스 내부 페이지에서 공통으로 사용하는 상단 헤더입니다.
import { Bell, LogOut, Search, Settings, UserRoundPlus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { WorkspaceMember } from '@/entities/workspace-member';
import { useLogout } from '@/shared/lib/use-logout';
import { cn } from '@/shared/lib/utils';
import type { WorkspaceNavigationItem } from '../model/workspace-navigation';

interface WorkspaceHeaderProps {
  navigationItems: WorkspaceNavigationItem[];
  currentMember: WorkspaceMember;
  workspaceId: string;
}

function getCurrentPageTitle(pathname: string, navigationItems: WorkspaceNavigationItem[]): string {
  const currentNavigationItem = navigationItems.find((item) => pathname.endsWith(`/${item.href}`));
  return currentNavigationItem?.label ?? '대시보드';
}

export function WorkspaceHeader({
  navigationItems,
  currentMember,
  workspaceId,
}: WorkspaceHeaderProps) {
  const pathname = usePathname();
  const title = getCurrentPageTitle(pathname, navigationItems);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const { handleLogout } = useLogout();

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
          className="flex h-10 items-center gap-2 rounded-2xl bg-[var(--color-brand)] px-4 text-sm font-bold text-white hover:bg-indigo-500"
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

        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setIsMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-400 text-sm font-bold text-white hover:opacity-90"
          >
            {currentMember.avatarLabel}
          </button>

          {isMenuOpen && (
            <div className="absolute top-12 right-0 z-50 w-44 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
              <Link
                href={`/workspaces/${workspaceId}/settings?tab=profile`}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  'hover:text-brand flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50',
                )}
              >
                <Settings className="h-4 w-4 text-slate-400" aria-hidden="true" />
                프로필 설정
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="hover:text-brand flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <LogOut className="h-4 w-4 text-slate-400" aria-hidden="true" />
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
