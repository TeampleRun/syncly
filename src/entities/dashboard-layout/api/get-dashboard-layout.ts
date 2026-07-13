// 현재 사용자의 워크스페이스별 대시보드 레이아웃을 조회하고, 저장값이 없으면 빈 레이아웃을 반환합니다.
import { getCurrentUserId } from '@/shared/api/supabase/current-user';
import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import type { Layout, LayoutItem } from 'react-grid-layout';

import type { DashboardLayoutState } from '../model/dashboard-layout.types';

function isLayoutItem(value: unknown): value is LayoutItem {
  if (!value || typeof value !== 'object') return false;

  const item = value as Record<string, unknown>;
  return (
    typeof item.i === 'string' &&
    typeof item.x === 'number' &&
    typeof item.y === 'number' &&
    typeof item.w === 'number' &&
    typeof item.h === 'number'
  );
}

function toDashboardLayout(value: unknown): Layout {
  return Array.isArray(value) && value.every(isLayoutItem) ? value : [];
}

export async function getDashboardLayout(
  workspaceId: string,
  pageType: string,
): Promise<DashboardLayoutState> {
  const supabase = await createSupabaseServerClient();
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from('user_dashboard_layouts')
    .select('layout')
    .eq('workspace_id', workspaceId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw new Error(`대시보드 레이아웃 조회에 실패했습니다: ${error.message}`);

  void pageType;
  return {
    layout: toDashboardLayout(data?.layout),
  };
}
