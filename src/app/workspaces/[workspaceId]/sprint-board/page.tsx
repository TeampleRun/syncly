// 스프린트 보드 라우트 — 선택 스프린트를 searchParam(?sprint=id)으로 읽어 client 컨테이너에 넘긴다.
// 스프린트/태스크는 컨테이너가 useQuery로 조회하고, 담당자 표시명 해석용 members만 서버에서 조회해 주입한다.
import { getWorkspaceMembersByWorkspaceId } from '@/entities/workspace-member/api/get-workspace-members-by-id';
import { assertWorkspaceRouteAccess } from '@/entities/workspace/lib/assert-workspace-route-access';
import { SprintBoardView } from '@/views/side-project/sprint-board';

interface SprintBoardRouteProps {
  params: Promise<{ workspaceId: string }>;
  searchParams: Promise<{ sprint?: string | string[] }>;
}

export default async function SprintBoardPage({ params, searchParams }: SprintBoardRouteProps) {
  const { workspaceId } = await params;
  await assertWorkspaceRouteAccess(workspaceId, 'sprint-board');
  const { sprint: sprintParam } = await searchParams;
  const selectedSprintId = typeof sprintParam === 'string' ? sprintParam : undefined;

  const members = await getWorkspaceMembersByWorkspaceId(workspaceId);

  return (
    <SprintBoardView
      workspaceId={workspaceId}
      selectedSprintId={selectedSprintId}
      initialMembers={members}
    />
  );
}
