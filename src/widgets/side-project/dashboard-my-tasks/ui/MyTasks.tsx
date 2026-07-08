// 내 업무 위젯 — 타일 크기에 따라 밀도가 다른 변형을 렌더
//  · sm: 진행 중 개수 헤드라인 + 대기 건수 요약
//  · md: task 리스트(상태 뱃지)
//  · lg: 상태별 카운트 요약 + task 리스트
import { mockTasks, TASK_STATUS, type TaskStatus } from '@/entities/side-project/task';
import type { WidgetSize } from '@/shared/dashboard/lib/widget-size';
import { WidgetCard, WidgetCardAction, WidgetCardHeader } from '@/shared/dashboard/ui/widget-card';

const header = (
  <WidgetCardHeader title="내 업무" action={<WidgetCardAction>전체 보기</WidgetCardAction>} />
);

const countBy = (status: TaskStatus) => mockTasks.filter((task) => task.status === status).length;

export default function MyTasks({ size = 'md' }: { size?: WidgetSize }) {
  if (size === 'sm') {
    return (
      <WidgetCard>
        {header}
        <div className="flex flex-1 flex-col justify-center">
          <p className="text-brand text-3xl font-extrabold">{countBy('progress')}</p>
          <p className="text-brand-muted mt-1 text-xs">진행 중 · 대기 {countBy('todo')}건</p>
        </div>
      </WidgetCard>
    );
  }

  const list = (
    <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
      {mockTasks.map((task) => {
        const status = TASK_STATUS[task.status];
        return (
          <li key={task.id} className="flex items-center gap-2">
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
  );

  if (size === 'lg') {
    return (
      <WidgetCard>
        {header}
        <div className="text-brand-muted border-brand/10 mb-3 flex gap-4 border-b pb-2 text-xs">
          <span>
            진행 중{' '}
            <strong style={{ color: TASK_STATUS.progress.text }}>{countBy('progress')}</strong>
          </span>
          <span>
            대기 <strong style={{ color: TASK_STATUS.todo.text }}>{countBy('todo')}</strong>
          </span>
          <span>
            완료 <strong style={{ color: TASK_STATUS.done.text }}>{countBy('done')}</strong>
          </span>
        </div>
        {list}
      </WidgetCard>
    );
  }

  // md
  return (
    <WidgetCard>
      {header}
      {list}
    </WidgetCard>
  );
}
