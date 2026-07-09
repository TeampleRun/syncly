// 스프린트 보드 라우트 — 선택 스프린트를 searchParam(?sprint=id)으로 읽어, RSC에서 해당 스프린트 데이터를 조회해 주입한다.
// 스프린트 전환 = URL 변경(네비게이션) → 이 RSC가 다시 실행되어 새 스프린트로 seed된다(클라 페칭 없음).
// 이후 태스크 변경은 클라이언트 낙관적 업데이트로 처리하며 재조회하지 않는다.
// 실 API 전환 시 아래 조회부만 async(Supabase)로 교체한다.
import { getSprints, resolveCurrentSprint } from '@/entities/side-project/sprint';
import { getBacklogTasks, getSprintTasks } from '@/entities/side-project/task';
import { mockWorkspaceMembers } from '@/entities/workspace-member';
import SprintBoardView from '@/views/side-project/sprint-board/ui/SprintBoardView';

interface SprintBoardRouteProps {
  params: Promise<{ workspaceId: string }>;
  searchParams: Promise<{ sprint?: string | string[] }>;
}

export default async function SprintBoardPage({ params, searchParams }: SprintBoardRouteProps) {
  const { workspaceId } = await params;
  const { sprint: sprintParam } = await searchParams;

  const sprints = getSprints(workspaceId);
  const selectedId = typeof sprintParam === 'string' ? sprintParam : undefined;
  // 선택값이 없거나 유효하지 않으면 데이터에서 현재 스프린트를 판정(진행 중 우선 → 없으면 최신)
  const sprint = sprints.find((item) => item.id === selectedId) ?? resolveCurrentSprint(sprints);

  // 스프린트가 하나도 없는 워크스페이스 — 빈 상태
  if (!sprint) {
    return (
      <div className="text-brand-muted flex min-h-full items-center justify-center p-6 text-sm">
        아직 생성된 스프린트가 없습니다.
      </div>
    );
  }

  const initialTasks = getSprintTasks(sprint.id);
  const initialBacklog = getBacklogTasks(workspaceId);

  return (
    <SprintBoardView
      workspaceId={workspaceId}
      sprint={sprint}
      sprints={sprints}
      initialTasks={initialTasks}
      initialBacklog={initialBacklog}
      members={mockWorkspaceMembers}
    />
  );
}
