// 진행률 차트 라우트 — 현재 스프린트를 판정해, 통계/벨로시티/상태 분포를 파생해 뷰에 주입한다.
// 상호작용이 없어 클라이언트 페칭 없이 RSC에서 데이터를 조립한다.
// 실 API 전환 시 아래 조회부만 async(Supabase)로 교체한다.
import { getSprints, resolveCurrentSprint, selectVelocity } from '@/entities/side-project/sprint';
import { countByStatus, getSprintTasks } from '@/entities/side-project/task';
import { ProgressChartView } from '@/views/side-project/progress-chart';
import { notFound } from 'next/navigation';
import { getMockWorkspaceById } from '@/entities/workspace';

interface ProgressChartRouteProps {
  params: Promise<{ workspaceId: string }>;
}

export default async function ProgressChartPage({ params }: ProgressChartRouteProps) {
  const { workspaceId } = await params;

  const workspace = getMockWorkspaceById(workspaceId);
  if(!workspace) return notFound()
  if (workspace.purpose === 'side-project') {
    const sprints = getSprints(workspaceId);
    // 진행 중(오늘이 기간 안) 스프린트 우선 → 없으면 최신
    const sprint = resolveCurrentSprint(sprints);

    // 스프린트가 하나도 없는 워크스페이스 — 빈 상태
    if (!sprint) {
      return (
        <div className="text-brand-muted flex min-h-full items-center justify-center p-6 text-sm">
          아직 생성된 스프린트가 없습니다.
        </div>
      );
    }

    const velocity = selectVelocity(sprints);
    const statusCounts = countByStatus(getSprintTasks(sprint.id));

    return <ProgressChartView sprint={sprint} velocity={velocity} statusCounts={statusCounts} />;
  }
  //TODO:
  return <></>;
}
