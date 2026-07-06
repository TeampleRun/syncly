// 스프린트 요약 위젯 — 그라데이션 스프린트 블록 + 포인트 통계(계획/완료/남은)를 하나의 카드로 구성
import { WidgetCard } from '@/shared/ui/widget-card';

import { sprint, stats, type DashboardStat } from '../config/summary';

function StatItem({ stat }: { stat: DashboardStat }) {
  return (
    <WidgetCard className="justify-between">
      <p className="text-brand-muted text-xs">{stat.label}</p>
      <p className="flex items-baseline gap-1">
        <span className="text-2xl font-extrabold" style={{ color: stat.color }}>
          {stat.value}
        </span>
        <span className="text-brand-muted text-xs">{stat.unit}</span>
      </p>
    </WidgetCard>
  );
}

export default function SprintSummary() {
  const [planned, done, remaining] = stats;

  return (
    <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-2">
      {/* 스프린트 그라데이션 블록 */}
      <div
        className="flex flex-col justify-between rounded-2xl p-5 text-white"
        style={{ backgroundImage: 'linear-gradient(169deg, #2b7fff 0%, #00b8db 100%)' }}
      >
        <div>
          <p className="text-xs font-semibold opacity-80">{sprint.name}</p>
          <p className="mt-1 text-lg font-extrabold">{sprint.period}</p>
        </div>
        <p className="flex items-end gap-2">
          <span className="text-3xl leading-none font-extrabold">{sprint.daysLeft}일</span>
          <span className="pb-1 text-sm opacity-80">남음</span>
        </p>
      </div>

      {/* 포인트 통계 3종 (계획/완료 상단, 남은 하단 전체 폭) */}
      <div className="grid grid-cols-2 gap-4">
        <StatItem stat={planned} />
        <StatItem stat={done} />
        <div className="col-span-2">
          <StatItem stat={remaining} />
        </div>
      </div>
    </div>
  );
}
