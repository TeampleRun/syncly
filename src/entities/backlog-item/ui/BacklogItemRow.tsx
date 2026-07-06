// 백로그 항목 한 줄 — 우선순위 점 + 제목 + 예상 포인트. 리스트(<ul>)는 소비 측에서 감싼다.
import { BACKLOG_PRIORITY_COLOR, type BacklogItem } from '../model/backlog-item';

export function BacklogItemRow({ item }: { item: BacklogItem }) {
  return (
    <li className="flex items-center gap-2">
      <span
        className="size-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: BACKLOG_PRIORITY_COLOR[item.priority] }}
      />
      <span className="text-brand-ink min-w-0 flex-1 truncate text-sm">{item.title}</span>
      <span className="text-brand-muted text-[10px]">{item.point}pt</span>
    </li>
  );
}
