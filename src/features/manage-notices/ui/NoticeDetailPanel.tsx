import { Star } from 'lucide-react';
import type { Notice } from '@/entities/notice';

interface NoticeDetailPanelProps {
  notice: Notice | null;
}

export function NoticeDetailPanel({ notice }: NoticeDetailPanelProps) {
  if (!notice) {
    return (
      <aside className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-6 text-sm font-medium text-slate-500">
        공지를 선택하면 내용이 표시됩니다.
      </aside>
    );
  }

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {notice.isPinned ? (
              <Star className="h-5 w-5 shrink-0 fill-amber-100 text-amber-500" aria-hidden="true" />
            ) : null}
            <h2 className="text-xl leading-7 font-bold text-slate-950">{notice.title}</h2>
          </div>
          <p className="mt-2 text-sm font-medium text-indigo-400">
            {notice.authorName} · {notice.createdAt}
          </p>
        </div>

        {notice.isPinned ? (
          <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-orange-600">
            고정
          </span>
        ) : null}
      </div>

      <p className="mt-6 text-base leading-7 whitespace-pre-line text-slate-800">
        {notice.content}
      </p>
    </aside>
  );
}
