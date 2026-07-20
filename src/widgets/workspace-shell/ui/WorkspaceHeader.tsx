'use client';

// 하나의 워크스페이스 내부 페이지에서 공통으로 사용하는 상단 헤더입니다.
import { LogOut, Settings, UserRoundPlus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { WorkspaceMember } from '@/entities/workspace-member';
import { WorkspaceSearchPanel } from '@/features/workspace-search';
import { NotificationPanel } from '@/features/workspace-notifications';
import { getAvatarColor } from '@/shared/lib/avatar-color';
import { useLogout } from '@/shared/lib/use-logout';
import { cn } from '@/shared/lib/utils';
import type { WorkspaceNavigationItem } from '../model/workspace-navigation';

interface WorkspaceHeaderProps {
  navigationItems: WorkspaceNavigationItem[];
  currentMember: WorkspaceMember;
  workspaceId: string;
}

function getCurrentPageTitle(pathname: string, navigationItems: WorkspaceNavigationItem[]): string {
  if (pathname.endsWith('/notifications')) return '알림';
  if (pathname.endsWith('/unavailable')) return '접근 제한';

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen && !isSearchOpen && !isNotificationOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setIsMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(target)) setIsSearchOpen(false);
      if (notificationRef.current && !notificationRef.current.contains(target)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen, isNotificationOpen, isSearchOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsSearchOpen(false);
      setIsNotificationOpen(false);
      setIsMenuOpen(false);
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const { handleLogout } = useLogout();

  return (
    <header className="flex h-[72px] items-center justify-between gap-3 border-b border-slate-200 bg-white px-3 sm:gap-4 sm:px-8">
      <h1 className="hidden shrink-0 text-lg font-bold text-slate-950 sm:block">{title}</h1>

      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <div ref={searchRef}>
          <WorkspaceSearchPanel
            workspaceId={workspaceId}
            isOpen={isSearchOpen}
            onOpenChange={(isOpen) => {
              setIsSearchOpen(isOpen);
              if (isOpen) {
                setIsNotificationOpen(false);
                setIsMenuOpen(false);
              }
            }}
          />
        </div>

        <Link
          href={`/workspaces/${workspaceId}/settings?tab=members`}
          className="flex h-10 shrink-0 items-center gap-2 rounded-xl bg-[var(--color-brand)] px-3 text-sm font-bold whitespace-nowrap text-white hover:bg-indigo-500 sm:px-4"
        >
          <UserRoundPlus className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">멤버 초대</span>
        </Link>

        <div ref={notificationRef}>
          <NotificationPanel
            workspaceId={workspaceId}
            viewerId={currentMember.userId}
            isOpen={isNotificationOpen}
            onOpenChange={(isOpen) => {
              setIsNotificationOpen(isOpen);
              if (isOpen) {
                setIsSearchOpen(false);
                setIsMenuOpen(false);
              }
            }}
          />
        </div>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setIsMenuOpen((value) => !value);
              setIsSearchOpen(false);
              setIsNotificationOpen(false);
            }}
            style={{ backgroundColor: getAvatarColor(currentMember.userId) }}
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white hover:opacity-90"
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
