// 내 업무 위젯 — 타일 크기에 따라 밀도가 다른 변형을 렌더
//  · sm: 진행 중 개수 헤드라인 + 대기 건수 요약
//  · md/lg: task 리스트(상태 뱃지)
import { mockTasks, TASK_STATUS } from '@/entities/task';
import type { WidgetSize } from '@/shared/lib/widget-size';
import { WidgetCard, WidgetCardAction, WidgetCardHeader } from '@/shared/ui/widget-card';

const header = (
  <WidgetCardHeader title="내 업무" action={<WidgetCardAction>전체 보기</WidgetCardAction>} />
);

export default function MyTasks({ size = 'md' }: { size?: WidgetSize }) {
  if (size === 'sm') {
    const inProgress = mockTasks.filter((task) => task.status === 'progress').length;
    const todo = mockTasks.filter((task) => task.status === 'todo').length;
    return (
      <WidgetCard>
        {header}
        <div className="flex flex-1 flex-col justify-center">
          <p className="text-brand text-3xl font-extrabold">{inProgress}</p>
          <p className="text-brand-muted mt-1 text-xs">진행 중 · 대기 {todo}건</p>
        </div>
      </WidgetCard>
    );
  }

  // md / lg — 리스트
  return (
    <WidgetCard>
      {header}
      <ul className="flex flex-col gap-2">
        {mockTasks.map((task) => {
          const status = TASK_STATUS[task.status];
          return (
            <li key={task.title} className="flex items-center gap-2">
              <span
                className="size-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: status.dot }}
              />
              <span className="text-brand-ink min-w-0 flex-1 truncate text-sm">{task.title}</span>
              <span className="text-brand-muted text-[10px]">{task.point}pt</span>
              <span
                className="rounded-full px-2 py-0.5 text-xs font-semibold"
                style={{ backgroundColor: status.bg, color: status.text }}
              >
                {status.label}
              </span>
            </li>
          );
        })}
      </ul>
    </WidgetCard>
  );
}
