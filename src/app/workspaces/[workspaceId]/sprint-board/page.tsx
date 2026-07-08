// 스프린트 보드 라우트 — 초기 데이터는 서버(RSC)에서 조회해 뷰에 주입한다.
// 이후 변경(추가/수정/삭제/이동)은 클라이언트 낙관적 업데이트로 처리하며 재조회하지 않는다.
// 목 단계: 단일 currentSprint 기준. 실 API 전환 시 아래 조회부만 교체한다:
//   const sprint = await getCurrentSprint(workspaceId);
//   const [initialTasks, initialBacklog] = await Promise.all([
//     getSprintTasks(sprint.id), getBacklogTasks(workspaceId),
//   ]);
import { currentSprint } from '@/entities/side-project/sprint';
import { getBacklogTasks, getSprintTasks } from '@/entities/side-project/task';
import { mockWorkspaceMembers } from '@/entities/workspace-member';
import { SprintBoardPage } from '@/views/side-project/sprint-board';

interface SprintBoardRouteProps {
  params: Promise<{ workspaceId: string }>;
}

export default async function SprintBoardRoute({ params }: SprintBoardRouteProps) {
  const { workspaceId } = await params;

  const sprint = currentSprint;
  const initialTasks = getSprintTasks(sprint.id);
  const initialBacklog = getBacklogTasks(sprint.workspaceId);
  // 담당자 후보 — 목 단계는 전체 멤버. 실 API: getWorkspaceMembers(workspaceId)


  return (
    <SprintBoardPage
      workspaceId={workspaceId}
      sprint={sprint}
      initialTasks={initialTasks}
      initialBacklog={initialBacklog}
      members={mockWorkspaceMembers}
    />
  );
}
