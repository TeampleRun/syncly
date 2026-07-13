'use client';

// 스프린트 보드 페이지 뷰 — useQuery로 스프린트/업무/백로그를 조회해 렌더한다(GET 컨벤션 §5).
// 선택 스프린트는 URL(?sprint=id)에서 온 selectedSprintId로 판정하고, 없으면 현재 스프린트로 폴백한다.
// 로딩/에러/빈 상태를 여기서 분기하고, 상호작용 보드/백로그는 feature에 위임한다.
// members는 아직 mock 유지(workspace-member 엔티티 api 준비 시 연동).
import { Plus_Jakarta_Sans } from 'next/font/google';

import { resolveCurrentSprint, useSprints } from '@/entities/side-project/sprint';
import { useBacklogTasks, useSprintTasks } from '@/entities/side-project/task';
import { getMockWorkspaceMembersByWorkspaceId } from '@/entities/workspace-member';
import { SprintBoard } from '@/features/manage-sprint-tasks';

import { SprintToolbar } from '@/features/manage-sprints';

import SprintSelector from './SprintSelector';
import SprintSummaryHeader from './SprintSummaryHeader';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

function CenteredMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-brand-muted flex min-h-full items-center justify-center p-6 text-sm">
      {children}
    </div>
  );
}

interface SprintBoardViewProps {
  workspaceId: string;
  selectedSprintId?: string;
}

export function SprintBoardView({ workspaceId, selectedSprintId }: SprintBoardViewProps) {
  const sprintsQuery = useSprints(workspaceId);
  // 선택값이 없거나 유효하지 않으면 데이터에서 현재 스프린트를 판정(진행 중 우선 → 없으면 최신)
  const sprint = sprintsQuery.data
    ? (sprintsQuery.data.find((item) => item.id === selectedSprintId) ??
      resolveCurrentSprint(sprintsQuery.data))
    : undefined;
  const tasksQuery = useSprintTasks(sprint?.id);
  const backlogQuery = useBacklogTasks(workspaceId);
  const members = getMockWorkspaceMembersByWorkspaceId(workspaceId);

  if (sprintsQuery.isPending) return <CenteredMessage>불러오는 중…</CenteredMessage>;
  if (sprintsQuery.isError)
    return <CenteredMessage>스프린트를 불러오지 못했습니다.</CenteredMessage>;

  // 스프린트가 하나도 없는 워크스페이스 — 빈 상태
  if (!sprint) return <CenteredMessage>아직 생성된 스프린트가 없습니다.</CenteredMessage>;

  if (tasksQuery.isPending || backlogQuery.isPending)
    return <CenteredMessage>불러오는 중…</CenteredMessage>;
  if (tasksQuery.isError || backlogQuery.isError)
    return <CenteredMessage>업무를 불러오지 못했습니다.</CenteredMessage>;

  return (
    <div className={`${jakarta.className} bg-brand-surface min-h-full`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <SprintSelector sprints={sprintsQuery.data} currentSprintId={sprint.id} />
        <SprintToolbar sprint={sprint} />
      </div>
      <SprintSummaryHeader sprint={sprint} />
      {/* key={sprint.id}: 스프린트 전환 시 보드를 리마운트해 초기 데이터로 다시 seed한다 */}
      <SprintBoard
        key={sprint.id}
        sprintId={sprint.id}
        workspaceId={workspaceId}
        tasks={tasksQuery.data}
        backlog={backlogQuery.data}
        members={members}
      />
    </div>
  );
}
