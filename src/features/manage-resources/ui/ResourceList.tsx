// 자료실의 파일과 링크 자료를 카드 목록으로 렌더링합니다.
import { Archive, ChevronRight, GitBranch, Link } from 'lucide-react';
import type { ResourceItem } from '@/entities/resource';
import { cn } from '@/shared/lib/utils';

interface ResourceListProps {
  resources: ResourceItem[];
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

export function ResourceList({ resources }: ResourceListProps) {
  return (
    <div className="space-y-4">
      {resources.map((resource) => {
        const Icon = getResourceIcon(resource);
        const typeLabel = resource.resourceType === 'file' ? '파일' : '링크';

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
                {resource.description || resource.url || resource.fileName}
              </p>
              <p className="mt-1 text-sm font-medium text-indigo-400">
                {resource.uploadedBy} · {resource.createdAt}
              </p>
            </div>

            <button
              type="button"
              aria-label={`${resource.title} 열기`}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-indigo-400 hover:bg-indigo-50 hover:text-[var(--color-brand)]"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </article>
        );
      })}
    </div>
  );
}
