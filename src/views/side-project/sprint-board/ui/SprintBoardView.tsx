// 스프린트 보드 페이지 셸 — 폰트/배경만 잡고, 서버에서 받은 초기 데이터를 하위로 전달한다.
// 순수 표시용 요약 헤더는 여기(뷰)에서 sprint를 받아 렌더하고, 상호작용 보드/백로그는 feature에 위임한다.
import { Plus_Jakarta_Sans } from 'next/font/google';

import type { Sprint } from '@/entities/side-project/sprint';
import type { Task } from '@/entities/side-project/task';
import type { WorkspaceMember } from '@/entities/workspace-member';
import { SprintBoard } from '@/features/sprint-board';

import SprintSelector from './SprintSelector';
import SprintSummaryHeader from './SprintSummaryHeader';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

interface SprintBoardViewProps {
  workspaceId: string;
  sprint: Sprint;
  sprints: Sprint[];
  initialTasks: Task[];
  initialBacklog: Task[];
  members: WorkspaceMember[];
}

export function SprintBoardView({
  workspaceId,
  sprint,
  sprints,
  initialTasks,
  initialBacklog,
  members,
}: SprintBoardViewProps) {
  return (
    <div className={`${jakarta.className} bg-brand-surface min-h-full`}>
      <SprintSelector sprints={sprints} currentSprintId={sprint.id} />
      <SprintSummaryHeader sprint={sprint} />
      {/* key={sprint.id}: 스프린트 전환 시 보드를 리마운트해 초기 데이터로 다시 seed한다 */}
      <SprintBoard
        key={sprint.id}
        sprintId={sprint.id}
        workspaceId={workspaceId}
        initialTasks={initialTasks}
        initialBacklog={initialBacklog}
        members={members}
      />
    </div>
  );
}
