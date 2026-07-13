// 스프린트 보드 라우트 — 선택 스프린트를 searchParam(?sprint=id)으로 읽어 client 컨테이너에 넘긴다.
// 데이터 조회(useQuery)와 스프린트 판정은 컨테이너가 담당하고, 태스크 변경은 보드의 클라이언트 낙관적 업데이트로 처리한다.
import { SprintBoardView } from '@/views/side-project/sprint-board';

interface SprintBoardRouteProps {
  params: Promise<{ workspaceId: string }>;
  searchParams: Promise<{ sprint?: string | string[] }>;
}

export default async function SprintBoardPage({ params, searchParams }: SprintBoardRouteProps) {
  const { workspaceId } = await params;
  const { sprint: sprintParam } = await searchParams;
  const selectedSprintId = typeof sprintParam === 'string' ? sprintParam : undefined;

  return (
    <SprintBoardView
      workspaceId={'00000000-0000-0000-0000-000000001002'}
      selectedSprintId={selectedSprintId}
    />
  );
}
