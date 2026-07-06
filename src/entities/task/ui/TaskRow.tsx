// 업무 한 줄 — 상태 점 + 제목 + 포인트 + 상태 뱃지. 리스트(<ul>)는 소비 측에서 감싼다.
import { TASK_STATUS, type Task } from '../model/task';

export function TaskRow({ task }: { task: Task }) {
  const status = TASK_STATUS[task.status];

  return (
    <li className="flex items-center gap-2">
      <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: status.dot }} />
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
}
