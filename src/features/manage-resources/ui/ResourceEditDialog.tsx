'use client';

// 기존 자료의 메타데이터를 수정한다. 파일은 교체하지 않고 제목·설명만 변경한다.
import { useState } from 'react';
import type { ResourceItem } from '@/entities/resource';

interface ResourceEditDialogProps {
  resource: ResourceItem;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (values: { title: string; description: string; url?: string }) => Promise<boolean>;
}

export function ResourceEditDialog({
  resource,
  isSaving,
  onClose,
  onSubmit,
}: ResourceEditDialogProps) {
  const [title, setTitle] = useState(resource.title);
  const [description, setDescription] = useState(resource.description);
  const [url, setUrl] = useState(resource.url ?? '');

  const canSubmit = title.trim().length > 0 && (resource.resourceType === 'file' || url.trim());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="resource-edit-dialog-title"
        className="w-full max-w-[470px] rounded-2xl bg-white p-6 shadow-2xl"
      >
        <h2 id="resource-edit-dialog-title" className="text-xl font-bold text-slate-950">
          자료 수정
        </h2>

        <div className="mt-5 space-y-3">
          {resource.resourceType === 'link' ? (
            <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
              URL
              <input
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://example.com"
                className="h-11 w-full rounded-xl bg-slate-100 px-4 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-300"
              />
            </label>
          ) : (
            <p className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-500">
              파일 교체는 지원하지 않습니다. 제목과 설명만 수정할 수 있습니다.
            </p>
          )}
          <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
            제목
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="자료 제목"
              className="h-11 w-full rounded-xl bg-slate-100 px-4 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-300"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
            <span>
              설명 <span className="font-normal text-slate-400">(선택)</span>
            </span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="자료에 대한 설명을 입력하세요."
              rows={3}
              className="min-h-16 w-full resize-none rounded-xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-300"
            />
          </label>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            disabled={isSaving}
            onClick={onClose}
            className="h-10 rounded-2xl bg-slate-100 px-4 text-sm font-bold text-slate-700 hover:bg-slate-200 disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            disabled={!canSubmit || isSaving}
            onClick={() => void onSubmit({ title, description, url })}
            className="h-10 rounded-2xl bg-[var(--color-brand)] px-4 text-sm font-bold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? '저장 중' : '저장'}
          </button>
        </div>
      </section>
    </div>
  );
}
