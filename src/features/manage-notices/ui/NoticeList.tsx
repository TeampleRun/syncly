'use client';

import { useState } from 'react';
import { MoreHorizontal, Pin, Star } from 'lucide-react';
import type { Notice, NoticeViewer } from '@/entities/notice';
import { cn } from '@/shared/lib/utils';

interface NoticeListProps {
  notices: Notice[];
  selectedNoticeId: string | null;
  onSelectNotice: (noticeId: string) => void;
  onEditNotice: (noticeId: string) => void;
  onDeleteNotice: (noticeId: string) => void;
  onTogglePinned: (noticeId: string) => void;
  viewer: NoticeViewer | null;
  isSaving: boolean;
}

export function NoticeList({
  notices,
  selectedNoticeId,
  onSelectNotice,
  onEditNotice,
  onDeleteNotice,
  onTogglePinned,
  viewer,
  isSaving,
}: NoticeListProps) {
  const [openMenuNoticeId, setOpenMenuNoticeId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {notices.map((notice) => {
        const isSelected = notice.id === selectedNoticeId;
        const isMenuOpen = notice.id === openMenuNoticeId;
        const canEdit = viewer?.role === 'owner' || viewer?.userId === notice.authorId;
        const canPin = viewer?.role === 'owner';
        const canManage = canEdit || canPin;

        return (
          <article
            key={notice.id}
            className={cn(
              'relative rounded-2xl border bg-white shadow-sm transition hover:border-indigo-200 hover:shadow-md',
              isSelected ? 'border-indigo-300 ring-1 ring-indigo-200' : 'border-slate-200',
            )}
          >
            <button
              type="button"
              onClick={() => onSelectNotice(notice.id)}
              className="block w-full rounded-2xl px-5 py-5 text-left"
            >
              <div className="flex min-w-0 items-start gap-3 pr-14">
                {notice.isPinned ? (
                  <Star
                    className="mt-0.5 h-5 w-5 shrink-0 fill-amber-100 text-amber-500"
                    aria-hidden="true"
                  />
                ) : null}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <h2 className="truncate text-base font-bold text-slate-950">{notice.title}</h2>
                    {notice.isPinned ? (
                      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-orange-600">
                        고정
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm font-medium text-indigo-400">
                    {notice.authorName} · {notice.createdAt}
                  </p>
                </div>
              </div>

              {isSelected ? (
                <p className="mt-5 border-t border-slate-100 pt-5 text-base leading-7 text-slate-800">
                  {notice.content}
                </p>
              ) : null}
            </button>

            {canManage ? (
              <div className="absolute top-4 right-4">
                <button
                  type="button"
                  aria-label={`${notice.title} 메뉴 열기`}
                  aria-expanded={isMenuOpen}
                  onClick={(event) => {
                    event.stopPropagation();
                    setOpenMenuNoticeId(isMenuOpen ? null : notice.id);
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
                </button>

                {isMenuOpen ? (
                  <div className="absolute right-0 z-10 mt-2 w-36 overflow-hidden rounded-xl border border-slate-200 bg-white py-2 text-sm font-bold text-slate-700 shadow-lg">
                    {canEdit ? (
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => {
                          onEditNotice(notice.id);
                          setOpenMenuNoticeId(null);
                        }}
                        className="block w-full px-4 py-2 text-left hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-50"
                      >
                        수정
                      </button>
                    ) : null}
                    {canPin ? (
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => {
                          void onTogglePinned(notice.id);
                          setOpenMenuNoticeId(null);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-50"
                      >
                        <Pin className="h-4 w-4" aria-hidden="true" />
                        {notice.isPinned ? '고정 해제' : '고정'}
                      </button>
                    ) : null}
                    {canEdit ? (
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => {
                          void onDeleteNotice(notice.id);
                          setOpenMenuNoticeId(null);
                        }}
                        className="block w-full px-4 py-2 text-left text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                      >
                        삭제
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
