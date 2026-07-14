'use client';

// 자료실에 실제 파일 또는 외부 링크를 추가하는 모달입니다.
import { useCallback, useEffect, useRef, useState } from 'react';
import { CloudUpload, GitBranch, Link, X } from 'lucide-react';
import type { ResourceFormValues, ResourceLinkProvider, ResourceType } from '@/entities/resource';
import { cn } from '@/shared/lib/utils';

interface ResourceAddDialogProps {
  isOpen: boolean;
  initialResourceType: ResourceType;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (values: ResourceFormValues) => Promise<boolean>;
}

const linkProviders: Array<{
  label: string;
  value: ResourceLinkProvider;
  icon: typeof Link;
}> = [
  { label: '링크', value: 'link', icon: Link },
  { label: '노션', value: 'notion', icon: Link },
  { label: '피그마', value: 'figma', icon: Link },
  { label: '깃허브', value: 'github', icon: GitBranch },
];

export function ResourceAddDialog({
  isOpen,
  initialResourceType,
  isSaving,
  onClose,
  onSubmit,
}: ResourceAddDialogProps) {
  const dialogRef = useRef<HTMLElement>(null);
  const [resourceType, setResourceType] = useState<ResourceType>(initialResourceType);
  const [linkProvider, setLinkProvider] = useState<ResourceLinkProvider>('link');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const canSubmit = resourceType === 'file' ? Boolean(file) : url.trim().length > 0;

  const resetForm = useCallback(() => {
    setResourceType(initialResourceType);
    setLinkProvider('link');
    setUrl('');
    setFile(null);
    setTitle('');
    setDescription('');
  }, [initialResourceType]);

  const closeDialog = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  const submitResource = async () => {
    const isSaved = await onSubmit({
      resourceType,
      linkProvider,
      url,
      file,
      title,
      description,
    });

    if (isSaved) resetForm();
  };

  const keepFocusInsideDialog = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Tab') {
      return;
    }

    const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button:not(:disabled), input:not(:disabled), textarea:not(:disabled), [href], [tabindex]:not([tabindex="-1"])',
    );

    if (!focusableElements?.length) {
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    dialogRef.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDialog();
      }
    };

    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [closeDialog, isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4">
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="resource-add-dialog-title"
        tabIndex={-1}
        onKeyDown={keepFocusInsideDialog}
        className="w-full max-w-[470px] rounded-2xl bg-white p-6 shadow-2xl outline-none"
      >
        <div className="flex items-center justify-between">
          <h2 id="resource-add-dialog-title" className="text-xl font-bold text-slate-950">
            자료 추가
          </h2>
          <button
            type="button"
            aria-label="자료 추가 닫기"
            onClick={closeDialog}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-6 grid h-11 grid-cols-2 rounded-2xl bg-slate-100 p-1">
          {(['link', 'file'] as ResourceType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setResourceType(type)}
              className={cn(
                'rounded-2xl text-sm font-bold text-slate-500',
                resourceType === type && 'bg-white text-[var(--color-brand)] shadow-sm',
              )}
            >
              {type === 'link' ? '링크' : '파일'}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {resourceType === 'file' ? (
            <label className="flex min-h-36 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-indigo-200 bg-slate-50 px-5 text-center">
              <CloudUpload className="h-8 w-8 text-[var(--color-brand)]" aria-hidden="true" />
              <span className="mt-3 text-sm font-bold text-slate-800">
                클릭해서 파일을 선택하세요
              </span>
              <span className="mt-1 text-xs font-medium text-slate-400">최대 5MB</span>
              <input
                type="file"
                className="sr-only"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              />
              {file ? (
                <span className="mt-2 max-w-full truncate text-xs font-bold text-[var(--color-brand)]">
                  {file.name}
                </span>
              ) : null}
            </label>
          ) : (
            <>
              <div className="flex flex-wrap gap-2">
                {linkProviders.map((provider) => {
                  const Icon = provider.icon;

                  return (
                    <button
                      key={provider.value}
                      type="button"
                      onClick={() => setLinkProvider(provider.value)}
                      className={cn(
                        'flex h-9 items-center gap-1.5 rounded-2xl border border-indigo-100 px-3 text-sm font-bold text-slate-500',
                        linkProvider === provider.value &&
                          'border-[var(--color-brand)] text-[var(--color-brand)]',
                      )}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {provider.label}
                    </button>
                  );
                })}
              </div>

              <input
                aria-label="자료 링크 URL"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://github.com/TeampleRun/syncly"
                className="h-11 w-full rounded-xl bg-slate-100 px-4 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-300"
              />
            </>
          )}

          <input
            aria-label="자료 제목"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={resourceType === 'file' ? '자료 제목 (비우면 파일명 사용)' : '자료 제목'}
            className="h-11 w-full rounded-xl bg-slate-100 px-4 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-300"
          />
          <textarea
            aria-label="자료 설명"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="설명 (선택)"
            rows={3}
            className="min-h-16 w-full resize-none rounded-xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={closeDialog}
            className="h-10 rounded-2xl bg-slate-100 px-4 text-sm font-bold text-slate-700 hover:bg-slate-200"
          >
            취소
          </button>
          <button
            type="button"
            disabled={!canSubmit || isSaving}
            onClick={() => void submitResource()}
            className="h-10 rounded-2xl bg-[var(--color-brand)] px-4 text-sm font-bold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? '저장 중' : '저장'}
          </button>
        </div>
      </section>
    </div>
  );
}
