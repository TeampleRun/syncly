// 스프린트 요약 위젯 — 스프린트 배너 + 포인트 통계 3종을 하나의 카드로 조립
import { currentSprint, sprintStats } from '@/entities/side-project/sprint';
import { StatCard } from '@/shared/side-project/ui/stat-card';

export default function SprintSummary() {
  const [planned, done, remaining] = sprintStats;

  return (
    <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-2">
      {/* 스프린트 배너 (그라데이션) */}
      <div
        className="flex h-full flex-col justify-between rounded-2xl p-5 text-white"
        style={{ backgroundImage: 'linear-gradient(169deg, #2b7fff 0%, #00b8db 100%)' }}
      >
        <div>
          <p className="text-xs font-semibold opacity-80">{currentSprint.name}</p>
          <p className="mt-1 text-lg font-extrabold">{currentSprint.period}</p>
        </div>
        <p className="flex items-end gap-2">
          <span className="text-3xl leading-none font-extrabold">{currentSprint.daysLeft}일</span>
          <span className="pb-1 text-sm opacity-80">남음</span>
        </p>
      </div>

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
