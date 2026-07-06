// 내 업무 위젯 — task 모델을 받아 대시보드용 compact 리스트로 렌더
import { mockTasks, TASK_STATUS } from '@/entities/task';
import { WidgetCard, WidgetCardAction, WidgetCardHeader } from '@/shared/ui/widget-card';

export default function MyTasks() {
  return (
    <WidgetCard>
      <WidgetCardHeader title="내 업무" action={<WidgetCardAction>스프린트</WidgetCardAction>} />
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
