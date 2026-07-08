// 사이드 프로젝트 업무 카드 — 카테고리 태그 · 포인트 · 제목 · 담당자를 표시하는 Task의 시각 표현.
// 색상 토큰(TASK_CATEGORY)은 같은 엔티티를 단일 출처로 사용한다.
// 상호작용(수정/삭제)은 상위(피처)에서 콜백으로 주입하는 구조로 확장한다.
import { getAvatarColor } from '../lib/avatar-color';
import { type Task, TASK_CATEGORY } from '../model/task.types';

export function TaskCard({ task }: { task: Task }) {
  const category = task.category ? TASK_CATEGORY[task.category] : null;

  return (
    <article className="border-brand/10 rounded-xl border bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        {category ? (
          <span
            className="rounded-md px-2 py-0.5 text-xs font-semibold"
            style={{ backgroundColor: category.bg, color: category.text }}
          >
            {category.label}
          </span>
        ) : (
          <span />
        )}
        <span className="text-brand-muted text-xs">{task.point}pt</span>
      </div>

      <p className="text-brand-ink mt-2 text-sm font-semibold">{task.title}</p>

      {task.assignee && (
        <div className="mt-3 flex items-center gap-2">
          <span
            className="flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: getAvatarColor(task.assignee.avatarLabel) }}
          >
            {task.assignee.avatarLabel}
          </span>
          <span className="text-brand-muted text-xs">{task.assignee.name}</span>
        </div>
      )}
    </article>
  );
}
