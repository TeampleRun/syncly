'use client';

// 백로그 위젯 — 타일 크기에 따라 밀도가 다른 변형을 렌더
//  · sm: 최상위 항목 1건 + 외 N건
//  · md/lg: 우선순위 점 + 항목 + 포인트 리스트(넘치면 스크롤)
// 워크스페이스의 백로그(스프린트 미편입) 업무를 실데이터로 조회한다.
import { TASK_PRIORITY, useBacklogTasks } from '@/entities/side-project/task';
import type { WidgetSize } from '@/shared/dashboard/lib/widget-size';
import { WidgetCard, WidgetCardAction, WidgetCardHeader } from '@/shared/dashboard/ui/widget-card';
import { WidgetStateMessage } from '@/shared/dashboard/ui/widget-state-message';

const header = (
  <WidgetCardHeader title="백로그" action={<WidgetCardAction>보드</WidgetCardAction>} />
);

interface BacklogProps {
  workspaceId: string;
  size?: WidgetSize;
}

export default function Backlog({ workspaceId, size = 'md' }: BacklogProps) {
  const { data: backlogItems, isError, isPending } = useBacklogTasks(workspaceId);

  if (isError) return <WidgetStateMessage header={header} message="백로그를 불러오지 못했습니다." />;
  if (isPending) return <WidgetStateMessage header={header} message="백로그를 불러오는 중입니다." />;
  if (backlogItems.length === 0)
    return <WidgetStateMessage header={header} message="백로그가 비어 있습니다." />;

  if (size === 'sm') {
    const [top, ...rest] = backlogItems;
    return (
      <WidgetCard>
        {header}
        <div className="flex items-center gap-2">
          <span
            className="size-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: TASK_PRIORITY[top.priority].color }}
          />
          <span className="text-brand-ink min-w-0 flex-1 truncate text-sm">{top.title}</span>
          {rest.length > 0 && <span className="text-brand-muted text-xs">외 {rest.length}건</span>}
        </div>
      </WidgetCard>
    );
  }

  return (
    <WidgetCard>
      {header}
      <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
        {backlogItems.map((item) => (
          <li key={item.id} className="flex items-center gap-2">
            <span
              className="size-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: TASK_PRIORITY[item.priority].color }}
            />
            <span className="text-brand-ink min-w-0 flex-1 truncate text-sm">{item.title}</span>
            <span className="text-brand-muted text-[10px]">{item.point}pt</span>
          </li>
        ))}
      </ul>
    </WidgetCard>
  );
}
