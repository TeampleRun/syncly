'use client';

// 워크스페이스 페이지에서 공통으로 사용하는 좌측 사이드바입니다.
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, LogOut, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { WORKSPACE_PURPOSE_META, type Workspace } from '@/entities/workspace';
import type { WorkspaceMember } from '@/entities/workspace-member';
import { getAvatarColor } from '@/shared/lib/avatar-color';
import { useLogout } from '@/shared/lib/use-logout';
import { cn } from '@/shared/lib/utils';
import type { WorkspaceNavigationItem } from '../model/workspace-navigation';

interface WorkspaceSidebarProps {
  workspace: Workspace;
  workspaceId: string;
  currentMember: WorkspaceMember;
  isCollapsed: boolean;
  navigationItems: WorkspaceNavigationItem[];
  onToggleCollapsed: () => void;
}

export function WorkspaceSidebar({
  workspace,
  workspaceId,
  currentMember,
  isCollapsed,
  navigationItems,
  onToggleCollapsed,
}: WorkspaceSidebarProps) {
  const pathname = usePathname();
  const purposeMeta = WORKSPACE_PURPOSE_META[workspace.purpose];

  const { handleLogout } = useLogout();
  const PurposeIcon = purposeMeta.icon;

  return (
    <aside
      className={cn(
        'sticky top-0 flex h-screen shrink-0 flex-col border-r border-slate-200 bg-white transition-[width] duration-200',
        isCollapsed ? 'w-[88px]' : 'w-[270px]',
      )}
    >
      <div
        className={cn(
          'flex h-[72px] items-center px-6',
          isCollapsed ? 'justify-center px-1' : 'justify-between',
        )}
      >
        <Image
          src="/images/header/logo.svg"
          alt="Syncly"
          width={isCollapsed ? 36 : 104}
          height={40}
          priority
        />
        <button
          type="button"
          aria-label={isCollapsed ? '사이드바 펼치기' : '사이드바 접기'}
          aria-expanded={!isCollapsed}
          onClick={onToggleCollapsed}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100',
            isCollapsed && 'absolute top-[84px] left-1/2 -translate-x-1/2',
          )}
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className={cn('border-y border-slate-100 py-4', isCollapsed ? 'px-3 pt-12' : 'px-4')}>
        <Link
          href="/workspaces"
          aria-label="워크스페이스 목록으로 이동"
          className={cn(
            'flex w-full items-center rounded-2xl bg-slate-50 text-left',
            isCollapsed ? 'justify-center px-0 py-3' : 'justify-between px-3 py-3',
          )}
        >
          <span className={cn('flex min-w-0 items-center', !isCollapsed && 'gap-3')}>
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white"
              style={{ backgroundImage: purposeMeta.gradient }}
            >
              <PurposeIcon className="h-4 w-4" aria-hidden="true" />
            </span>
            <span
              className={cn('truncate text-sm font-bold text-slate-950', isCollapsed && 'sr-only')}
            >
              {workspace.name}
            </span>
          </span>
          {!isCollapsed ? (
            <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
          ) : null}
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const href = `/workspaces/${workspaceId}/${item.href}`;
          const isActive = pathname === href;

          return (
            <Link
              key={item.href}
              href={href}
              className={cn(
                'flex h-12 items-center rounded-2xl text-base font-bold text-slate-400 hover:bg-indigo-50 hover:text-indigo-600',
                isCollapsed ? 'justify-center px-0' : 'gap-3 px-4',
                isActive && 'bg-indigo-50 text-indigo-600',
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span className={cn(isCollapsed && 'sr-only')}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div
        className={cn(
          'flex h-[92px] items-center border-t border-slate-100 px-6',
          isCollapsed ? 'justify-center px-3' : 'justify-between',
        )}
      >
        <div className={cn('flex min-w-0 items-center', !isCollapsed && 'gap-3')}>
          <span
            style={{ backgroundColor: getAvatarColor(currentMember.userId) }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
          >
            {currentMember.avatarLabel}
          </span>
          <span className={cn('min-w-0', isCollapsed && 'sr-only')}>
            <span className="block truncate text-sm font-bold text-slate-950">
              {currentMember.workspaceNickname}
            </span>
            <span className="block text-xs text-slate-500">
              {currentMember.role === 'owner' ? '매니저' : '멤버'}
            </span>
          </span>
        </div>

        {!isCollapsed ? (
          <button
            type="button"
            aria-label="로그아웃"
            onClick={handleLogout}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </aside>
  );
}
