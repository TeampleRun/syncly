// 벨로시티 위젯 — 스프린트별 계획/완료 포인트를 막대로 비교
// 막대가 2그룹뿐이라 별도 차트 라이브러리 없이 순수 CSS(div height %)로 구현한다.
import { sprintVelocity, VELOCITY_MAX } from '@/entities/sprint';
import { WidgetCard, WidgetCardHeader } from '@/shared/ui/widget-card';

export default function Velocity() {
  return (
    <WidgetCard>
      <WidgetCardHeader title="벨로시티" />
      <div className="flex min-h-0 flex-1 gap-3">
        {/* Y축 눈금 */}
        <div className="text-brand-muted flex flex-col justify-between pb-5 text-[9px]">
          <span>{VELOCITY_MAX}</span>
          <span>{VELOCITY_MAX / 2}</span>
          <span>0</span>
        </div>

        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 items-end justify-around gap-6 border-b border-brand/10">
            {sprintVelocity.map((point) => (
              <div key={point.sprint} className="flex h-full items-end gap-1.5">
                <div
                  className="w-5 rounded-t-sm bg-[#c7d2fe]"
                  style={{ height: `${(point.planned / VELOCITY_MAX) * 100}%` }}
                  title={`계획 ${point.planned}pt`}
                />
                <div
                  className="w-5 rounded-t-sm bg-[#2b7fff]"
                  style={{ height: `${(point.completed / VELOCITY_MAX) * 100}%` }}
                  title={`완료 ${point.completed}pt`}
                />
              </div>
            ))}
          </div>
          <div className="text-brand-muted flex justify-around gap-6 pt-1.5 text-[10px]">
            {sprintVelocity.map((point) => (
              <span key={point.sprint}>{point.sprint}</span>
            ))}
          </div>
        </div>
      </div>
    </WidgetCard>
  );
}
