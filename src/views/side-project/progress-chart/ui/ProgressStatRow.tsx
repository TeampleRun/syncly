// 진행률 차트 상단 통계 3종 — 완료/남은 포인트, 스프린트 진행률(%)
// 모두 currentSprint의 포인트 메타에서 파생한다(별도 데이터 없음).
import type { Sprint } from '@/entities/side-project/sprint';
import { WidgetCard } from '@/shared/dashboard/ui/widget-card';

interface ProgressStat {
  id: string;
  /** 표시 문자열 — 포인트는 숫자, 진행률은 '%'까지 포함 */
  display: string;
  label: string;
  color: string;
}

export default function ProgressStatRow({ sprint }: { sprint: Sprint }) {
  const { totalPoints, completedPoints } = sprint;
  const remaining = totalPoints - completedPoints;
  // 계획이 0pt인 스프린트(엣지 케이스)에서 NaN이 되지 않도록 방어
  const progress = totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;

  const stats: ProgressStat[] = [
    { id: 'completed', display: `${completedPoints}`, label: '완료 포인트', color: '#00a63e' },
    { id: 'remaining', display: `${remaining}`, label: '남은 포인트', color: '#e17100' },
    { id: 'progress', display: `${progress}%`, label: '스프린트 진행률', color: '#155dfc' },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <WidgetCard key={stat.id} className="items-center justify-center gap-1 py-10">
          <p className="text-3xl font-extrabold" style={{ color: stat.color }}>
            {stat.display}
          </p>
          <p className="text-brand-muted text-sm">{stat.label}</p>
        </WidgetCard>
      ))}
    </div>
  );
}
