// 상태 분포 도넛 차트 — 현재 스프린트 태스크의 status(완료/진행 중/대기) 건수 비율
// 차트 라이브러리 없이 SVG stroke-dasharray로 도넛을 그린다. r을 15.915로 두면 원둘레 ≈ 100 이라
// dasharray를 백분율 그대로 쓸 수 있다.
import { TASK_STATUS, type TaskStatus } from '@/entities/side-project/task';
import { cn } from '@/shared/lib/utils';
import { WidgetCard } from '@/shared/dashboard/ui/widget-card';

// 도넛/범례 표시 순서 + 색상(Figma 지정값). 라벨은 TASK_STATUS에서 재사용.
const SEGMENTS: { status: TaskStatus; color: string }[] = [
  { status: 'done', color: '#5b4ee8' },
  { status: 'in_progress', color: '#7c6ff7' },
  { status: 'todo', color: '#e2e0fb' },
];

const RADIUS = 15.915; // 원둘레 ≈ 100 → dasharray를 % 단위로 사용

export default function StatusDonutChart({
  counts,
  className,
}: {
  counts: Record<TaskStatus, number>;
  className?: string;
}) {
  const total = SEGMENTS.reduce((sum, { status }) => sum + counts[status], 0);

  // 세그먼트를 누적 오프셋으로 이어 그린다(12시 방향 시작 = offset 25).
  let accumulated = 0;
  const arcs = SEGMENTS.map(({ status, color }) => {
    const percent = total > 0 ? (counts[status] / total) * 100 : 0;
    const arc = { status, color, percent, offset: 25 - accumulated };
    accumulated += percent;
    return arc;
  });

  return (
    <WidgetCard className={cn('min-h-[280px]', className)}>
      <h3 className="text-brand-ink mb-4 text-sm font-bold">상태 분포</h3>
      <div className="flex flex-1 items-center justify-center gap-8">
        <svg viewBox="0 0 42 42" className="h-40 w-40" role="img" aria-label="상태 분포 도넛 차트">
          {/* 트랙 */}
          <circle cx="21" cy="21" r={RADIUS} fill="none" stroke="#f1f3f9" strokeWidth="6" />
          {total > 0 &&
            arcs.map((arc) => (
              <circle
                key={arc.status}
                cx="21"
                cy="21"
                r={RADIUS}
                fill="none"
                stroke={arc.color}
                strokeWidth="6"
                strokeDasharray={`${arc.percent} ${100 - arc.percent}`}
                strokeDashoffset={arc.offset}
              />
            ))}
        </svg>

        <ul className="flex flex-col gap-3">
          {SEGMENTS.map(({ status, color }) => (
            <li key={status} className="flex items-center gap-2.5">
              <span
                className="size-3 shrink-0 rounded-full"
                style={{ backgroundColor: color }}
                aria-hidden
              />
              <span className="text-brand-ink text-sm">{TASK_STATUS[status].label}</span>
              <span className="text-brand-ink ml-1 text-sm font-bold">{counts[status]}건</span>
            </li>
          ))}
        </ul>
      </div>
    </WidgetCard>
  );
}
