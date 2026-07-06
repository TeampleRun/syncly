// 스프린트 요약 위젯 — 스프린트 배너 + 포인트 통계 3종을 하나의 카드로 조립(레이아웃만 담당)
import { SprintBanner, currentSprint, sprintStats } from '@/entities/sprint';
import { StatCard } from '@/shared/ui/stat-card';

export default function SprintSummary() {
  const [planned, done, remaining] = sprintStats;

  return (
    <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-2">
      <SprintBanner sprint={currentSprint} />

      {/* 포인트 통계 3종 (계획/완료 상단, 남은 하단 전체 폭) */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard stat={planned} />
        <StatCard stat={done} />
        <div className="col-span-2">
          <StatCard stat={remaining} />
        </div>
      </div>
    </div>
  );
}
