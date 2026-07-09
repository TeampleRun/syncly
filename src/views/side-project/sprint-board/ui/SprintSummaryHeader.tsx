// 스프린트 요약 헤더 — 스프린트 메타(기간·진행률·남은 일수/포인트)를 그라데이션 배너로 표시.
// 순수 표시용이라 sprint를 props로 받는다(상호작용 없음). 진행률은 완료/총 포인트에서 파생.
import type { Sprint } from '@/entities/side-project/sprint';

// 'YYYY-MM-DD' → 'M/D'
const monthDay = (iso: string) => {
  const [, month, day] = iso.split('-');
  return `${Number(month)}/${Number(day)}`;
};

export default function SprintSummaryHeader({ sprint }: { sprint: Sprint }) {
  const { name, startDate, endDate, daysLeft, totalPoints, completedPoints } = sprint;
  const remainingPoints = totalPoints - completedPoints;
  const percent = totalPoints === 0 ? 0 : Math.round((completedPoints / totalPoints) * 100);
  const period = `${monthDay(startDate)} – ${monthDay(endDate)}`;

  return (
    <section
      className="mb-6 flex items-center justify-between gap-6 rounded-2xl p-6 text-white"
      style={{ backgroundImage: 'linear-gradient(135deg, #2b7fff 0%, #00b8db 100%)' }}
    >
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold opacity-80">현재 스프린트</p>
        <h2 className="mt-1 text-2xl font-extrabold">
          {name} · {period}
        </h2>

        {/* 진행률 바 */}
        <div className="mt-4 h-2 w-full max-w-xs overflow-hidden rounded-full bg-white/25">
          <div className="h-full rounded-full bg-white" style={{ width: `${percent}%` }} />
        </div>
        <p className="mt-2 text-sm font-medium opacity-90">
          {completedPoints}/{totalPoints}pt 완료 ({percent}%)
        </p>
      </div>

      {/* 남은 일수 · 남은 포인트 */}
      <div className="flex shrink-0 gap-8">
        <div className="text-right">
          <p className="text-3xl font-extrabold">{daysLeft}일</p>
          <p className="mt-1 text-xs opacity-80">남은 일수</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-extrabold">{remainingPoints}pt</p>
          <p className="mt-1 text-xs opacity-80">남은 포인트</p>
        </div>
      </div>
    </section>
  );
}
