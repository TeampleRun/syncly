// 스프린트 진행률 프로그레스 바 — 완료/계획 포인트 대비 소진율을 그라데이션 바로 표시
import type { Sprint } from '@/entities/side-project/sprint';
import { cn } from '@/shared/lib/utils';
import { WidgetCard } from '@/shared/dashboard/ui/widget-card';

export default function SprintProgressCard({
  sprint,
  className,
}: {
  sprint: Sprint;
  className?: string;
}) {
  const { totalPoints, completedPoints } = sprint;
  const progress = totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;

  return (
    <WidgetCard className={cn('justify-center', className)}>
      <h3 className="text-brand-ink text-sm font-bold">스프린트 진행률</h3>
      <p className="text-brand-muted mt-1 text-xs">
        {completedPoints} / {totalPoints}pt 완료
      </p>
      <div className="mt-4 h-5 w-full overflow-hidden rounded-full bg-[#f1f3f9]">
        <div
          className="flex h-full min-w-fit items-center justify-end rounded-full pr-2"
          style={{
            width: `${progress}%`,
            backgroundImage: 'linear-gradient(to right, #615fff, #8e51ff)',
          }}
        >
          <span className="text-[10px] font-bold text-white">{progress}%</span>
        </div>
      </div>
    </WidgetCard>
  );
}
