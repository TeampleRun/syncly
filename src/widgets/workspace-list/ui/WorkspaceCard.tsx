import Link from 'next/link';
import { Check, ChevronRight, Clock, Users } from 'lucide-react';
import { formatRelativeTime } from '@/shared/lib/date';
import { WORKSPACE_PURPOSE_META, type WorkspaceSummary } from '@/entities/workspace';

interface WorkspaceCardProps {
  workspace: WorkspaceSummary;
}

// 워크스페이스 요약 카드 — 클릭 시 해당 워크스페이스로 이동(상세 대시보드는 별도 이슈, 지금은 라우팅 스텁)
export default function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const { id, name, purpose, member_count, task_count, done_task_count, progress, updated_at } =
    workspace;
  const meta = WORKSPACE_PURPOSE_META[purpose];
  const PurposeIcon = meta.icon;

  return (
    <Link
      href={`/workspaces/${id}`}
      className="border-brand/10 hover:border-brand/30 flex w-full items-start gap-4 rounded-[16px] border bg-white p-5.25 transition-colors"
    >
      <div
        className="flex size-12 shrink-0 items-center justify-center rounded-[18px]"
        style={{ backgroundImage: meta.gradient }}
      >
        <PurposeIcon className="size-6 text-white" aria-hidden />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-brand-ink text-lg leading-[27px] font-bold">{name}</h3>
            <p className="text-brand-muted text-xs leading-4">{meta.label}</p>
          </div>
          <ChevronRight className="text-brand-muted mt-1 size-4 shrink-0" aria-hidden />
        </div>
        <div className="text-brand-muted flex items-center gap-4 text-xs leading-4">
          <span className="flex items-center gap-1.5">
            <Users className="size-3.5" aria-hidden />
            {member_count}명
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" aria-hidden />
            {formatRelativeTime(updated_at)}
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="size-3.5" aria-hidden />
            {done_task_count}/{task_count} 완료
          </span>
        </div>
        <div className="flex items-center gap-5">
          <span className="text-brand-muted text-xs leading-4">진행률</span>
          <div className="bg-brand-secondary h-1.5 flex-1 overflow-hidden rounded-full">
            <div
              className="from-brand-start to-brand-end h-full rounded-full bg-linear-to-r"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-brand-muted text-xs leading-4">{progress}%</span>
        </div>
      </div>
    </Link>
  );
}
