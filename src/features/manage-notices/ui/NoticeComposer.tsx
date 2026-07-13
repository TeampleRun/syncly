'use client';

import { useState } from 'react';
import type { Notice, NoticeFormValues } from '@/entities/notice';

interface NoticeComposerProps {
  editingNotice: Notice | null;
  onSubmit: (values: NoticeFormValues) => Promise<void>;
  onCancel: () => void;
}

export function NoticeComposer({ editingNotice, onSubmit, onCancel }: NoticeComposerProps) {
  const [title, setTitle] = useState(editingNotice?.title ?? '');
  const [content, setContent] = useState(editingNotice?.content ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = title.trim().length > 0 && content.trim().length > 0;

  return (
    <form
      className="rounded-2xl border border-indigo-200 bg-white p-6 shadow-sm"
      onSubmit={async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        await onSubmit({ title, content });
        setIsSubmitting(false);
      }}
    >
      <h2 className="text-base font-bold text-slate-950">
        {editingNotice ? '공지 수정' : '새 공지 작성'}
      </h2>

      <div className="mt-4 space-y-4">
        <label className="block">
          <span className="sr-only">공지 제목</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="제목을 입력하세요"
            className="h-14 w-full rounded-2xl bg-slate-100 px-5 text-base font-medium text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-300"
          />
        </label>

        <label className="block">
          <span className="sr-only">공지 내용</span>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="내용을 입력하세요"
            rows={4}
            className="min-h-28 w-full resize-none rounded-2xl bg-slate-100 px-5 py-4 text-base font-medium text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-300"
          />
        </label>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="h-11 rounded-2xl bg-[var(--color-brand)] px-5 text-sm font-bold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? '저장 중' : editingNotice ? '저장' : '등록'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="h-11 rounded-2xl bg-slate-100 px-5 text-sm font-bold text-slate-700 hover:bg-slate-200"
        >
          취소
        </button>
      </div>
    </form>
  );
}
