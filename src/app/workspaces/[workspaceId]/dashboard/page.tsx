// 워크스페이스 대시보드 라우트 — 레이아웃은 서버(RSC)에서 조회해 initialLayout으로 주입한다.
// (레이아웃 조회 키: user_id + workspace_id + page_type / 저장분 없으면 빈 대시보드로 시작)
// purpose는 추가 가능한 위젯을 템플릿별로 거르는 데만 쓰인다.
import { getDashboardLayout } from '@/entities/dashboard-layout';
import { DashboardView } from '@/views/dashboard';
import { getWorkspace } from '@/entities/workspace';

interface DashboardPageProps {
  params: Promise<{ workspaceId: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { workspaceId } = await params;

    const [workspace, initialLayout] = await Promise.all([
        getWorkspace(workspaceId),
        getDashboardLayout(workspaceId, 'dashboard'),
      ]);
  return (
    <DashboardView
      key={workspaceId}
      workspaceId={workspaceId}
      purpose={workspace.purpose}
      initialLayout={initialLayout}
    />
  );
}
