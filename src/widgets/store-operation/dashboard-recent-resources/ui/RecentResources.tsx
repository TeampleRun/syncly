// 최근 자료 위젯 — 타일 크기에 따라 밀도가 다른 변형을 렌더
//  · sm: 가장 최근 자료 1건(제목만)
//  · md: 리스트(제목 + 업로더)
//  · lg: 총 개수 + 리스트(제목 + 설명 미리보기 + 업로더)
import { Archive, GitBranch, Link } from 'lucide-react';

import { mockResources, type ResourceItem } from '@/entities/resource';
import type { WidgetSize } from '@/shared/dashboard/lib/widget-size';
import { WidgetCard, WidgetCardAction, WidgetCardHeader } from '@/shared/dashboard/ui/widget-card';
import { cn } from '@/shared/lib/utils';

// 작성일(내림차순) 정렬 — "최근" 자료를 위로. 원본 배열을 변형하지 않도록 복사 후 정렬한다.
const sortedResources = [...mockResources].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

const header = (
  <WidgetCardHeader title="최근 자료" action={<WidgetCardAction>자료실</WidgetCardAction>} />
);

// 자료 타입별 앞머리 아이콘 — 파일은 Archive, github 링크는 GitBranch, 그 외 링크는 Link.
// (자료실 ResourceList.getResourceIcon과 동일한 규칙)
function ResourceGlyph({ resource }: { resource: ResourceItem }) {
  if (resource.resourceType === 'file') return <Archive className="size-4" aria-hidden="true" />;
  if (resource.linkProvider === 'github')
    return <GitBranch className="size-4" aria-hidden="true" />;
  return <Link className="size-4" aria-hidden="true" />;
}

// 아이콘을 감싸는 타입별 색상 타일 — 파일은 인디고, 링크는 블루로 구분한다(자료실 페이지 기준).
function ResourceIcon({ resource, className }: { resource: ResourceItem; className?: string }) {
  const isFile = resource.resourceType === 'file';
  return (
    <span
      className={cn(
        'text-brand flex shrink-0 items-center justify-center rounded-xl',
        isFile ? 'bg-indigo-100' : 'bg-blue-100',
        className,
      )}
    >
      <ResourceGlyph resource={resource} />
    </span>
  );
}

export default function RecentResources({ size = 'md' }: { size?: WidgetSize }) {
  if (size === 'sm') {
    const latest = sortedResources[0];
    return (
      <WidgetCard>
        {header}
        <div className="flex items-center gap-2">
          <ResourceIcon resource={latest} className="size-8" />
          <span className="text-brand-ink truncate text-sm font-semibold">{latest.title}</span>
        </div>
      </WidgetCard>
    );
  }

  if (size === 'lg') {
    return (
      <WidgetCard>
        {header}
        <p className="text-brand-muted mb-2 text-xs">총 {sortedResources.length}개의 자료</p>
        <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
          {sortedResources.map((resource) => (
            <li
              key={resource.id}
              className="bg-brand-surface flex items-center gap-3 rounded-xl p-3"
            >
              <ResourceIcon resource={resource} className="size-10" />
              <div className="min-w-0">
                <p className="text-brand-ink truncate text-sm font-semibold">{resource.title}</p>
                <p className="text-brand-muted truncate text-xs">{resource.description}</p>
                <p className="text-brand-muted mt-0.5 text-[11px]">{resource.uploadedBy}</p>
              </div>
            </li>
          ))}
        </ul>
      </WidgetCard>
    );
  }

  // md — 리스트(제목 + 업로더)
  return (
    <WidgetCard>
      {header}
      <ul className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
        {sortedResources.map((resource) => (
          <li key={resource.id} className="flex items-center gap-3">
            <ResourceIcon resource={resource} className="size-10" />
            <div className="min-w-0">
              <p className="text-brand-ink truncate text-sm font-semibold">{resource.title}</p>
              <p className="text-brand-muted text-[11px]">{resource.uploadedBy}</p>
            </div>
          </li>
        ))}
      </ul>
    </WidgetCard>
  );
}
