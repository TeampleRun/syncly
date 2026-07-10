// 진행률 차트 페이지 셸 — 폰트/배경만 잡고, 서버에서 파생·주입된 데이터를 하위 표현 컴포넌트에 전달한다.
// 상호작용이 없어 전부 표현용(서버 컴포넌트)이다.
import { Plus_Jakarta_Sans } from 'next/font/google';

import type { Sprint, VelocityPoint } from '@/entities/side-project/sprint';
import type { TaskStatus } from '@/entities/side-project/task';

import ProgressStatRow from './ProgressStatRow';
import SprintProgressCard from './SprintProgressCard';
import StatusDonutChart from './StatusDonutChart';
import VelocityChart from './VelocityChart';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

interface ProgressChartViewProps {
  sprint: Sprint;
  velocity: VelocityPoint[];
  statusCounts: Record<TaskStatus, number>;
}

export function ProgressChartView({ sprint, velocity, statusCounts }: ProgressChartViewProps) {
  return (
    <div className={`${jakarta.className} bg-brand-surface min-h-full p-6`}>
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
