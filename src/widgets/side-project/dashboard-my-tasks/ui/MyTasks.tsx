'use client';

// 내 업무 위젯 — 같은 tasks 테이블을 템플릿(purpose)별로 다르게 투영한다.
//  · side-project: 현재 스프린트에 편입된 "나에게 배정된" 업무 (포인트/상태)
//  · team-project: 워크스페이스의 "나에게 배정된" 보드 업무 (마감일/상태)
// 두 도메인의 Task 모양·status 표기가 달라, 훅 규칙을 지키려 서브컴포넌트로 분기한다
// (조건부 훅 호출 불가 → purpose로 컴포넌트를 갈라 각자 자기 훅만 호출).
import { resolveCurrentSprint, useSprints } from '@/entities/side-project/sprint';
import {
  TASK_STATUS,
  useSprintTasks,
  type TaskStatus as SprintTaskStatus,
} from '@/entities/side-project/task';
import { useTasksByWorkspaceId, type TaskStatus as TeamTaskStatus } from '@/entities/task';
import type { WidgetSize } from '@/shared/dashboard/lib/widget-size';
import type { WorkspacePurpose } from '@/shared/dashboard/model/template.types';
import { WidgetCard, WidgetCardAction, WidgetCardHeader } from '@/shared/dashboard/ui/widget-card';

const header = (
  <WidgetCardHeader title="내 업무" action={<WidgetCardAction>전체 보기</WidgetCardAction>} />
);

function StateMessage({ message }: { message: string }) {
  return (
    <WidgetCard>
      {header}
      <div className="text-brand-muted flex min-h-0 flex-1 items-center justify-center text-center text-sm">
        {message}
      </div>
    </WidgetCard>
  );
}

interface MyTasksProps {
  workspaceId: string;
  purpose: WorkspacePurpose;
  currentUserId: string;
  size?: WidgetSize;
}

export default function MyTasks({ workspaceId, purpose, currentUserId, size = 'md' }: MyTasksProps) {
  if (purpose === 'side-project') {
    return <SideMyTasks workspaceId={workspaceId} currentUserId={currentUserId} size={size} />;
  }
  return <TeamMyTasks workspaceId={workspaceId} currentUserId={currentUserId} size={size} />;
}

interface BranchProps {
  workspaceId: string;
  currentUserId: string;
  size: WidgetSize;
}

// ── side-project: 현재 스프린트 × 나에게 배정된 업무 (포인트/상태) ──────────────
function SideMyTasks({ workspaceId, currentUserId, size }: BranchProps) {
  const sprintsQuery = useSprints(workspaceId);
  const currentSprint = sprintsQuery.data ? resolveCurrentSprint(sprintsQuery.data) : undefined;
  const tasksQuery = useSprintTasks(currentSprint?.id);

  if (sprintsQuery.isError || tasksQuery.isError) {
    return <StateMessage message="내 업무를 불러오지 못했습니다." />;
  }
  if (sprintsQuery.isPending) return <StateMessage message="내 업무를 불러오는 중입니다." />;
  if (!currentSprint) return <StateMessage message="진행 중인 스프린트가 없습니다." />;
  if (tasksQuery.isPending) return <StateMessage message="내 업무를 불러오는 중입니다." />;

  const myTasks = tasksQuery.data.filter((task) => task.assigneeId === currentUserId);
  if (myTasks.length === 0) return <StateMessage message="이번 스프린트에 배정된 업무가 없습니다." />;

  const countBy = (status: SprintTaskStatus) =>
    myTasks.filter((task) => task.status === status).length;

  if (size === 'sm') {
    return (
      <WidgetCard>
        {header}
        <div className="flex flex-1 flex-col justify-center">
          <p className="text-brand text-3xl font-extrabold">{countBy('in_progress')}</p>
          <p className="text-brand-muted mt-1 text-xs">진행 중 · 대기 {countBy('todo')}건</p>
        </div>
      </WidgetCard>
    );
  }

  const list = (
    <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
      {myTasks.map((task) => {
        const status = TASK_STATUS[task.status];
        return (
          <li key={task.id} className="flex items-center gap-2">
            <span
              className="size-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: status.dot }}
            />
            <span className="text-brand-ink min-w-0 flex-1 truncate text-sm">{task.title}</span>
            <span className="text-brand-muted text-[10px]">{task.point}pt</span>
            <span
              className="rounded-full px-2 py-0.5 text-xs font-semibold"
              style={{ backgroundColor: status.bg, color: status.text }}
            >
              {status.label}
            </span>
          </li>
        );
      })}
    </ul>
  );

  if (size === 'lg') {
    return (
      <WidgetCard>
        {header}
        <div className="text-brand-muted border-brand/10 mb-3 flex gap-4 border-b pb-2 text-xs">
          <span>
            진행 중{' '}
            <strong style={{ color: TASK_STATUS.in_progress.text }}>
              {countBy('in_progress')}
            </strong>
          </span>
          <span>
            대기 <strong style={{ color: TASK_STATUS.todo.text }}>{countBy('todo')}</strong>
          </span>
          <span>
            완료 <strong style={{ color: TASK_STATUS.done.text }}>{countBy('done')}</strong>
          </span>
        </div>
        {list}
      </WidgetCard>
    );
  }

  return (
    <WidgetCard>
      {header}
      {list}
    </WidgetCard>
  );
}

// ── team-project: 워크스페이스 × 나에게 배정된 보드 업무 (마감일/상태) ──────────
interface TeamStatusStyle {
  label: string;
  dot: string;
  bg: string;
  text: string;
}

const TEAM_STATUS: Record<TeamTaskStatus, TeamStatusStyle> = {
  todo: { label: '대기', dot: '#d1d5dc', bg: '#f3f4f6', text: '#6a7282' },
  'in-progress': { label: '진행 중', dot: '#2b7fff', bg: '#e0e7ff', text: '#432dd7' },
  done: { label: '완료', dot: '#22c55e', bg: '#dcfce7', text: '#16a34a' },
};

function TeamMyTasks({ workspaceId, currentUserId, size }: BranchProps) {
  const { data, isError, isPending } = useTasksByWorkspaceId(workspaceId);

  if (isError) return <StateMessage message="내 업무를 불러오지 못했습니다." />;
  if (isPending) return <StateMessage message="내 업무를 불러오는 중입니다." />;

  const myTasks = data.filter((task) => task.assigneeId === currentUserId);
  if (myTasks.length === 0) return <StateMessage message="배정된 업무가 없습니다." />;

  const countBy = (status: TeamTaskStatus) =>
    myTasks.filter((task) => task.status === status).length;

  if (size === 'sm') {
    return (
      <WidgetCard>
        {header}
        <div className="flex flex-1 flex-col justify-center">
          <p className="text-brand text-3xl font-extrabold">{countBy('in-progress')}</p>
          <p className="text-brand-muted mt-1 text-xs">진행 중 · 대기 {countBy('todo')}건</p>
        </div>
      </WidgetCard>
    );
  }

  const list = (
    <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
      {myTasks.map((task) => {
        const status = TEAM_STATUS[task.status];
        return (
          <li key={task.id} className="flex items-center gap-2">
            <span
              className="size-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: status.dot }}
            />
            <span className="text-brand-ink min-w-0 flex-1 truncate text-sm">{task.title}</span>
            <span className="text-brand-muted text-[10px]">{task.dueDate}</span>
            <span
              className="rounded-full px-2 py-0.5 text-xs font-semibold"
              style={{ backgroundColor: status.bg, color: status.text }}
            >
              {status.label}
            </span>
          </li>
        );
      })}
    </ul>
  );

  if (size === 'lg') {
    return (
      <WidgetCard>
        {header}
        <div className="text-brand-muted border-brand/10 mb-3 flex gap-4 border-b pb-2 text-xs">
          <span>
            진행 중{' '}
            <strong style={{ color: TEAM_STATUS['in-progress'].text }}>
              {countBy('in-progress')}
            </strong>
          </span>
          <span>
            대기 <strong style={{ color: TEAM_STATUS.todo.text }}>{countBy('todo')}</strong>
          </span>
          <span>
            완료 <strong style={{ color: TEAM_STATUS.done.text }}>{countBy('done')}</strong>
          </span>
        </div>
        {list}
      </WidgetCard>
    );
  }

  return (
    <WidgetCard>
      {header}
      {list}
    </WidgetCard>
  );
}
