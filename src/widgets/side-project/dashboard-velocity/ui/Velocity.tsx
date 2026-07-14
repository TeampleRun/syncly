'use client';

// 벨로시티 위젯 — 스프린트별 계획/완료 포인트를 막대로 비교
// 막대가 2그룹뿐이라 별도 차트 라이브러리 없이 순수 CSS(div height %)로 구현한다.
// Y축 최댓값은 실데이터 포인트에서 파생(selectVelocityMax)해 막대 잘림·납작함을 막는다.
import {
  selectVelocity,
  selectVelocityMax,
  useSprints,
} from '@/entities/side-project/sprint';
import { WidgetCard, WidgetCardHeader } from '@/shared/dashboard/ui/widget-card';

const header = <WidgetCardHeader title="벨로시티" />;

function StateMessage({ message }: { message: string }) {
  return (
    <WidgetCard>
      {header}
      <div className="text-brand-muted flex min-h-0 flex-1 items-center justify-center text-center text-sm">
        {message}
      </div>
    </WidgetCard>
  );
}

export default function Velocity({ workspaceId }: { workspaceId: string }) {
  const { data: sprints, isError, isPending } = useSprints(workspaceId);

  if (isError) return <StateMessage message="벨로시티를 불러오지 못했습니다." />;
  if (isPending) return <StateMessage message="벨로시티를 불러오는 중입니다." />;

  const sprintVelocity = selectVelocity(sprints);
  if (sprintVelocity.length === 0) return <StateMessage message="스프린트 데이터가 없습니다." />;

  const velocityMax = selectVelocityMax(sprintVelocity);

  return (
    <WidgetCard>
      {header}
      <div className="flex min-h-0 flex-1 gap-3">
        {/* Y축 눈금 */}
        <div className="text-brand-muted flex flex-col justify-between pb-5 text-[9px]">
          <span>{velocityMax}</span>
          <span>{velocityMax / 2}</span>
          <span>0</span>
        </div>

        <div className="flex flex-1 flex-col">
          <div className="border-brand/10 flex flex-1 items-end justify-around gap-6 border-b">
            {sprintVelocity.map((point) => (
              <div key={point.sprint} className="flex h-full items-end gap-1.5">
                <div
                  className="w-5 rounded-t-sm bg-[#c7d2fe]"
                  style={{ height: `${(point.planned / velocityMax) * 100}%` }}
                  title={`계획 ${point.planned}pt`}
                />
                <div
                  className="w-5 rounded-t-sm bg-[#2b7fff]"
                  style={{ height: `${(point.completed / velocityMax) * 100}%` }}
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
