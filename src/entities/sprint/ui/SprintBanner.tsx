// 스프린트 배너 — 스프린트 엔티티를 그라데이션 카드로 표현(기간/남은 일수 강조)
import type { Sprint } from '../model/sprint';

export function SprintBanner({ sprint }: { sprint: Sprint }) {
  return (
    <div
      className="flex h-full flex-col justify-between rounded-2xl p-5 text-white"
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
  );
}
