// 워크스페이스 목적별 사이드바 메뉴 항목을 정의합니다.
import type { WorkspacePurpose } from '@/entities/workspace';
import {
  BarChart3,
  Bell,
  Calendar,
  ClipboardList,
  FileBox,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Rocket,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export interface WorkspaceNavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const storeOperationNavigationItems: WorkspaceNavigationItem[] = [
  { label: '대시보드', href: 'dashboard', icon: LayoutDashboard },
  { label: '업무 스케줄', href: 'work-schedule', icon: ClipboardList },
  { label: '공지', href: 'notices', icon: Bell },
  { label: '자료실', href: 'files', icon: FileBox },
  { label: '채팅', href: 'chat', icon: MessageSquare },
  { label: '캘린더', href: 'calendar', icon: Calendar },
  { label: '설정', href: 'settings', icon: Settings },
];

export const sideProjectNavigationItems: WorkspaceNavigationItem[] = [
  { label: '대시보드', href: 'dashboard', icon: LayoutDashboard },
  { label: '스프린트 보드', href: 'sprint-board', icon: Rocket },
  { label: '캘린더', href: 'calendar', icon: Calendar },
  { label: '회의록', href: 'meeting-notes', icon: FileText },
  { label: '자료실', href: 'files', icon: FileBox },
  { label: '채팅', href: 'chat', icon: MessageSquare },
  { label: '진행률 차트', href: 'progress-chart', icon: BarChart3 },
  { label: '설정', href: 'settings', icon: Settings },
];

export const teamProjectNavigationItems: WorkspaceNavigationItem[] = [
  { label: '대시보드', href: 'dashboard', icon: LayoutDashboard },
  { label: '프로젝트 관리', href: 'project-management', icon: Rocket },
  { label: '캘린더', href: 'calendar', icon: Calendar },
  { label: '공지', href: 'notices', icon: Bell },
  { label: '회의록', href: 'meeting-notes', icon: FileText },
  { label: '자료실', href: 'files', icon: FileBox },
  { label: '채팅', href: 'chat', icon: MessageSquare },
  { label: '진행률 차트', href: 'progress-chart', icon: BarChart3 },
  { label: '설정', href: 'settings', icon: Settings },
];

export const workspaceNavigationByPurpose = {
  'store-operation': storeOperationNavigationItems,
  'team-project': teamProjectNavigationItems,
  'side-project': sideProjectNavigationItems,
} satisfies Record<WorkspacePurpose, WorkspaceNavigationItem[]>;
