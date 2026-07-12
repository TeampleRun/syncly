'use client';

// 진행률 차트 페이지 뷰 — useQuery로 스프린트/업무를 조회하고 파생값을 계산해 렌더한다(GET 컨벤션 §5).
// 로딩/에러/빈 상태를 여기서 분기하고, 하위 차트 컴포넌트는 순수 표현만 담당한다.
import { Plus_Jakarta_Sans } from 'next/font/google';

import { resolveCurrentSprint, selectVelocity, useSprints } from '@/entities/side-project/sprint';
import { countByStatus, useSprintTasks } from '@/entities/side-project/task';

import ProgressStatRow from './ProgressStatRow';
import SprintProgressCard from './SprintProgressCard';
import StatusDonutChart from './StatusDonutChart';
import VelocityChart from './VelocityChart';

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

export function ProgressChartView({ workspaceId }: { workspaceId: string }) {
  const sprintsQuery = useSprints(workspaceId);
  // 진행 중(오늘이 기간 안) 스프린트 우선 → 없으면 최신. 로딩 중이면 undefined.
  const sprint = sprintsQuery.data ? resolveCurrentSprint(sprintsQuery.data) : undefined;
  const tasksQuery = useSprintTasks(sprint?.id);

  if (sprintsQuery.isPending) return <CenteredMessage>불러오는 중…</CenteredMessage>;
  if (sprintsQuery.isError) return <CenteredMessage>진행률을 불러오지 못했습니다.</CenteredMessage>;

  // 스프린트가 하나도 없는 워크스페이스 — 빈 상태
  if (!sprint) return <CenteredMessage>아직 생성된 스프린트가 없습니다.</CenteredMessage>;

  if (tasksQuery.isPending) return <CenteredMessage>불러오는 중…</CenteredMessage>;
  if (tasksQuery.isError) return <CenteredMessage>업무를 불러오지 못했습니다.</CenteredMessage>;

  const velocity = selectVelocity(sprintsQuery.data);
  const statusCounts = countByStatus(tasksQuery.data);

  return (
    <div className={`${jakarta.className} bg-brand-surface min-h-full`}>
      <div className="flex flex-col gap-4">
        <ProgressStatRow sprint={sprint} />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* 좌: 진행률 바(짧음) + 상태 도넛(김) 세로 스택 */}
          <div className="flex flex-col gap-4">
            <SprintProgressCard sprint={sprint} />
            <StatusDonutChart counts={statusCounts} className="flex-1" />
          </div>

          {/* 우: 벨로시티 막대(좌측 컬럼 전체 높이) */}
          <VelocityChart data={velocity} />
        </div>
      </div>
    </div>
  );
}
