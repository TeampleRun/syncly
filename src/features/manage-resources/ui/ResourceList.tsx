'use client';

// 자료실의 파일과 링크 자료를 카드 목록으로 렌더링합니다.
import { Archive, ChevronRight, Download, GitBranch, Link, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import {
  RESOURCE_LINK_PROVIDER_LABEL,
  type ResourceItem,
  type ResourceViewer,
} from '@/entities/resource';
import { cn } from '@/shared/lib/utils';

interface ResourceListProps {
  resources: ResourceItem[];
  onOpenFile: (resource: ResourceItem) => void;
  onEditResource: (resourceId: string) => void;
  onDeleteResource: (resourceId: string) => void;
  viewer: ResourceViewer | null;
  isSaving: boolean;
}

function getResourceIcon(resource: ResourceItem) {
  if (resource.resourceType === 'file') {
    return Archive;
  }

  if (resource.linkProvider === 'github') {
    return GitBranch;
  }

  return Link;
}

function openResource(resource: ResourceItem, onOpenFile: (resource: ResourceItem) => void) {
  if (resource.resourceType === 'link' && resource.url) {
    window.open(resource.url, '_blank', 'noopener,noreferrer');
    return;
  }

  onOpenFile(resource);
}

export function ResourceList({
  resources,
  onOpenFile,
  onEditResource,
  onDeleteResource,
  viewer,
  isSaving,
}: ResourceListProps) {
  const [openMenuResourceId, setOpenMenuResourceId] = useState<string | null>(null);

  if (resources.length === 0) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-[var(--color-brand)]">
          <Archive className="h-6 w-6" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-base font-bold text-slate-900">아직 등록된 자료가 없습니다.</h2>
        <p className="mt-1 text-sm text-slate-500">
          파일을 업로드하거나 필요한 링크를 저장해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {resources.map((resource) => {
        const Icon = getResourceIcon(resource);
        const typeLabel =
          resource.resourceType === 'file'
            ? '파일'
            : RESOURCE_LINK_PROVIDER_LABEL[resource.linkProvider ?? 'link'];
        // 파일은 다운로드, 링크는 외부 페이지 이동이라는 서로 다른 동작을 아이콘으로 구분합니다.
        const ActionIcon = resource.resourceType === 'file' ? Download : ChevronRight;
        const isMenuOpen = openMenuResourceId === resource.id;
        const canManage =
          viewer?.role === 'owner' || (viewer?.userId && viewer.userId === resource.uploadedById);

        return (
          <article
            key={resource.id}
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
          >
            <div
              className={cn(
                'flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl',
                resource.resourceType === 'file' ? 'bg-indigo-100' : 'bg-blue-100',
              )}
            >
              <Icon className="h-6 w-6 text-[var(--color-brand)]" aria-hidden="true" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-base font-bold text-slate-950">{resource.title}</h2>
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-xs font-bold',
                    resource.resourceType === 'file'
                      ? 'bg-indigo-100 text-[var(--color-brand)]'
                      : 'bg-slate-100 text-slate-500',
                  )}
                >
                  {typeLabel}
                </span>
              </div>
              <p className="mt-1 truncate text-sm font-medium text-slate-500">
                {resource.description || resource.url}
              </p>
              <p className="mt-1 text-sm font-medium text-indigo-400">
                {resource.uploadedBy} · {resource.createdAt}
              </p>
            </div>

            <div className="relative flex shrink-0 items-center gap-1">
              {canManage ? (
                <button
                  type="button"
                  aria-label={`${resource.title} 메뉴 열기`}
                  aria-expanded={isMenuOpen}
                  onClick={() => setOpenMenuResourceId(isMenuOpen ? null : resource.id)}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
                </button>
              ) : null}
              <button
                type="button"
                aria-label={`${resource.title} ${resource.resourceType === 'file' ? '다운로드' : '열기'}`}
                onClick={() => openResource(resource, onOpenFile)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-indigo-400 hover:bg-indigo-50 hover:text-[var(--color-brand)]"
              >
                <ActionIcon className="h-5 w-5" aria-hidden="true" />
              </button>

              {isMenuOpen ? (
                <div className="absolute top-11 right-10 z-10 w-32 overflow-hidden rounded-xl border border-slate-200 bg-white py-2 text-sm font-bold text-slate-700 shadow-lg">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => {
                      onEditResource(resource.id);
                      setOpenMenuResourceId(null);
                    }}
                    className="block w-full px-4 py-2 text-left hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-50"
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => {
                      void onDeleteResource(resource.id);
                      setOpenMenuResourceId(null);
                    }}
                    className="block w-full px-4 py-2 text-left text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                  >
                    삭제
                  </button>
                </div>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
