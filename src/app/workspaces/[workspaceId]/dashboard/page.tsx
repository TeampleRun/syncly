// 워크스페이스 대시보드 라우트 — 레이아웃은 서버(RSC)에서 조회해 initialLayout으로 주입한다.
// (레이아웃 조회 키: user_id + workspace_id / 저장분 없으면 빈 대시보드로 시작)
// purpose는 추가 가능한 위젯을 템플릿별로 거르는 데만 쓰인다.
import { getDashboardLayout } from '@/entities/dashboard-layout/api/get-dashboard-layout';
import { DashboardView } from '@/views/dashboard';
import { notFound } from 'next/navigation';
import { getWorkspaceById } from '@/entities/workspace/api/get-workspace-by-id';
import { getCurrentUserId } from '@/shared/api/supabase/current-user';

interface DashboardPageProps {
  params: Promise<{ workspaceId: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { workspaceId } = await params;

  const workspace = await getWorkspaceById(workspaceId);

  if (!workspace) {
    notFound();
  }

  const [initialLayout, currentUserId] = await Promise.all([
    getDashboardLayout(workspaceId, 'dashboard'),
    getCurrentUserId(),
  ]);
  return (
    <DashboardView
      key={workspaceId}
      workspaceId={workspaceId}
      purpose={workspace.purpose}
      currentUserId={currentUserId}
      initialLayout={initialLayout}
    />
  );
}
