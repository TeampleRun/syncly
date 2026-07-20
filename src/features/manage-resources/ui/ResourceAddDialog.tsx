'use client';

// 자료실에 실제 파일 또는 외부 링크를 추가하는 모달입니다.
import { useCallback, useEffect, useRef, useState, type DragEvent } from 'react';
import { CloudUpload, GitBranch, Link, X } from 'lucide-react';
import {
  RESOURCE_LINK_PROVIDER_LABEL,
  RESOURCE_LINK_PROVIDERS,
  type ResourceFormValues,
  type ResourceLinkProvider,
  type ResourceType,
} from '@/entities/resource';
import { cn } from '@/shared/lib/utils';

interface ResourceAddDialogProps {
  isOpen: boolean;
  initialResourceType: ResourceType;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (values: ResourceFormValues) => Promise<boolean>;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

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
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const canSubmit = resourceType === 'file' ? Boolean(file) : url.trim().length > 0;

  const resetForm = useCallback(() => {
    setResourceType(initialResourceType);
    setLinkProvider('link');
    setUrl('');
    setFile(null);
    setFileError(null);
    setIsDraggingFile(false);
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

  // 파일 선택과 드래그앤드롭 입력을 같은 검증 규칙으로 처리합니다.
  const selectFile = (nextFile: File | null) => {
    if (!nextFile) return;

    if (nextFile.size > MAX_FILE_SIZE_BYTES) {
      setFile(null);
      setFileError('파일은 5MB 이하만 업로드할 수 있습니다.');
      return;
    }

    setFile(nextFile);
    setFileError(null);
  };

  const handleFileDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDraggingFile(false);
    selectFile(event.dataTransfer.files.item(0));
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
            <label
              onDragEnter={(event) => {
                event.preventDefault();
                setIsDraggingFile(true);
              }}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={(event) => {
                if (event.currentTarget.contains(event.relatedTarget as Node)) return;
                setIsDraggingFile(false);
              }}
              onDrop={handleFileDrop}
              className={cn(
                'flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 text-center transition-colors',
                isDraggingFile
                  ? 'border-[var(--color-brand)] bg-indigo-50'
                  : 'border-indigo-200 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/50',
              )}
            >
              <CloudUpload className="h-8 w-8 text-[var(--color-brand)]" aria-hidden="true" />
              <span className="mt-3 text-sm font-bold text-slate-800">
                파일을 끌어 놓거나 클릭해서 선택하세요
              </span>
              <span className="mt-1 text-xs font-medium text-slate-400">최대 5MB</span>
              <input
                type="file"
                className="sr-only"
                onChange={(event) => selectFile(event.target.files?.[0] ?? null)}
              />
              {file ? (
                <span className="mt-2 max-w-full truncate text-xs font-bold text-[var(--color-brand)]">
                  {file.name}
                </span>
              ) : null}
              {fileError ? (
                <span className="mt-2 text-xs font-bold text-rose-600">{fileError}</span>
              ) : null}
            </label>
          ) : (
            <>
              <div className="flex flex-wrap gap-2">
                {RESOURCE_LINK_PROVIDERS.map((provider) => {
                  const Icon = provider === 'github' ? GitBranch : Link;

                  return (
                    <button
                      key={provider}
                      type="button"
                      onClick={() => setLinkProvider(provider)}
                      className={cn(
                        'flex h-9 items-center gap-1.5 rounded-2xl border border-indigo-100 px-3 text-sm font-bold text-slate-500',
                        linkProvider === provider &&
                          'border-[var(--color-brand)] text-[var(--color-brand)]',
                      )}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {RESOURCE_LINK_PROVIDER_LABEL[provider]}
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
