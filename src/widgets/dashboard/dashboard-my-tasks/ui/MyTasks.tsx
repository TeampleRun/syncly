// 내 업무 위젯 — task 엔티티(TaskRow)를 리스트로 조립
import { mockTasks, TaskRow } from '@/entities/task';
import { WidgetCard, WidgetCardAction, WidgetCardHeader } from '@/shared/ui/widget-card';

export default function MyTasks() {
  return (
    <WidgetCard>
      <WidgetCardHeader title="내 업무" action={<WidgetCardAction>스프린트</WidgetCardAction>} />
      <ul className="flex flex-col gap-2">
        {mockTasks.map((task) => (
          <TaskRow key={task.title} task={task} />
        ))}
      </ul>
    </WidgetCard>
  );
}
