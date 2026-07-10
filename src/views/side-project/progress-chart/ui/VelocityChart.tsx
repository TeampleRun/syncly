// 스프린트별 벨로시티 막대 차트 — 스프린트마다 완료 포인트를 막대로 비교
// 막대 수가 적어 차트 라이브러리 없이 CSS(div height %)로 구현한다(대시보드 Velocity 위젯과 동일 방침).
import type { VelocityPoint } from '@/entities/side-project/sprint';
import { cn } from '@/shared/lib/utils';
import { WidgetCard } from '@/shared/dashboard/ui/widget-card';

// Y축 눈금 개수(0 포함 5단계) — 상단값을 4로 나눠 균등 배치한다.
const TICK_STEPS = 4;

export default function VelocityChart({
  data,
  className,
}: {
  data: VelocityPoint[];
  className?: string;
}) {
  const maxCompleted = Math.max(1, ...data.map((point) => point.completed));
  // 상단 눈금값을 4의 배수로 올림 → 0/¼/½/¾/max 눈금이 정수로 떨어진다.
  const top = Math.ceil(maxCompleted / TICK_STEPS) * TICK_STEPS;
  // 위에서 아래로 그리기 위해 큰 값부터 나열
  const ticks = Array.from({ length: TICK_STEPS + 1 }, (_, i) => (top / TICK_STEPS) * (TICK_STEPS - i));

  return (
    <WidgetCard className={cn('min-h-[280px]', className)}>
      <h3 className="text-brand-ink mb-4 text-sm font-bold">스프린트별 벨로시티</h3>
      <div className="flex min-h-0 flex-1 gap-3">
        {/* Y축 눈금 */}
        <div className="text-brand-muted flex flex-col justify-between pb-6 text-[10px]">
          {ticks.map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>

        <div className="flex flex-1 flex-col">
          <div className="border-brand/10 flex flex-1 items-end justify-around border-b">
            {data.map((point) => (
              <div key={point.sprint} className="flex h-full w-16 items-end justify-center">
                <div
                  className="w-10 rounded-t bg-[#2b7fff]"
                  style={{ height: `${(point.completed / top) * 100}%` }}
                  title={`${point.completed}pt 완료`}
                />
              </div>
            ))}
          </div>
          <div className="text-brand-muted flex justify-around pt-2 text-[11px]">
            {data.map((point) => (
              <span key={point.sprint} className="w-16 text-center">
                {point.sprint}
              </span>
            ))}
          </div>
        </div>
      </div>
    </WidgetCard>
  );
}
