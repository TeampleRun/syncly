// 최근 공지 위젯 — 타일 크기에 따라 밀도가 다른 변형을 렌더
//  · sm: 가장 최근 공지 1건(제목만)
//  · md: 리스트(제목 + 작성자·작성일)
//  · lg: 총 개수 + 리스트(제목 + 본문 미리보기 + 작성자·작성일)
import { Bell, Pin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import { getNoticeBoard } from '@/entities/notice/api/get-notice-board';
import { noticeBoardQueryKey } from '@/entities/notice/model/notice-query';
import type { Notice } from '@/entities/notice';
import type { WidgetSize } from '@/shared/dashboard/lib/widget-size';
import { WidgetCard, WidgetCardAction, WidgetCardHeader } from '@/shared/dashboard/ui/widget-card';
import { cn } from '@/shared/lib/utils';

const header = (
  <WidgetCardHeader title="최근 공지" action={<WidgetCardAction>전체 보기</WidgetCardAction>} />
);

// 공지 앞머리 아이콘 — 고정 공지는 노란색 Pin, 일반 공지는 Bell로 구분한다.
// className에는 레이아웃(크기·정렬)만 전달하고, 색상은 고정 여부에 따라 여기서 정한다.
function NoticeIcon({ isPinned, className }: { isPinned: boolean; className?: string }) {
  const Icon = isPinned ? Pin : Bell;
  return (
    <Icon
      className={cn(isPinned ? 'text-amber-500' : 'text-brand-muted', className)}
      aria-hidden="true"
    />
  );
}

// "작성자 · 작성일" 형태의 메타 텍스트
function noticeMeta(notice: Notice) {
  return `${notice.authorName} · ${notice.createdAt}`;
}

interface RecentNoticesProps {
  workspaceId: string;
  size?: WidgetSize;
}

export default function RecentNotices({ workspaceId, size = 'md' }: RecentNoticesProps) {
  const { data, isError, isPending } = useQuery({
    queryKey: noticeBoardQueryKey(workspaceId),
    queryFn: () => getNoticeBoard(workspaceId),
  });

  if (isError) {
    return (
      <WidgetCard>
        {header}
        <div className="text-brand-muted flex min-h-0 flex-1 items-center justify-center text-center text-sm">
          최근 공지를 불러오지 못했습니다.
        </div>
      </WidgetCard>
    );
  }

  if (isPending || !data) {
    return (
      <WidgetCard>
        {header}
        <div className="text-brand-muted flex min-h-0 flex-1 items-center justify-center text-center text-sm">
          최근 공지를 불러오는 중입니다.
        </div>
      </WidgetCard>
    );
  }

  const notices = data.notices;

  if (notices.length === 0) {
    return (
      <WidgetCard>
        {header}
        <div className="text-brand-muted flex min-h-0 flex-1 items-center justify-center text-center text-sm">
          등록된 공지가 없습니다.
        </div>
      </WidgetCard>
    );
  }

  if (size === 'sm') {
    const latest = notices[0];
    return (
      <WidgetCard>
        {header}
        <div className="flex items-center gap-2">
          <NoticeIcon isPinned={latest.isPinned} className="size-4 shrink-0" />
          <span className="text-brand-ink truncate text-sm font-semibold">{latest.title}</span>
        </div>
      </WidgetCard>
    );
  }

  if (size === 'lg') {
    return (
      <WidgetCard>
        {header}
        <p className="text-brand-muted mb-2 text-xs">총 {notices.length}개의 공지</p>
        <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
          {notices.map((notice) => (
            <li key={notice.id} className="bg-brand-surface flex items-start gap-2 rounded-xl p-3">
              <NoticeIcon isPinned={notice.isPinned} className="mt-0.5 size-4 shrink-0" />
              <div className="min-w-0">
                <p className="text-brand-ink truncate text-sm font-semibold">{notice.title}</p>
                <p className="text-brand-muted truncate text-xs">{notice.content}</p>
                <p className="text-brand-muted mt-0.5 text-[11px]">{noticeMeta(notice)}</p>
              </div>
            </li>
          ))}
        </ul>
      </WidgetCard>
    );
  }

  // md — 리스트(제목 + 작성자·작성일)
  return (
    <WidgetCard>
      {header}
      <ul className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
        {notices.map((notice) => (
          <li key={notice.id} className="flex items-start gap-2">
            <NoticeIcon isPinned={notice.isPinned} className="mt-0.5 size-4 shrink-0" />
            <div className="min-w-0">
              <p className="text-brand-ink truncate text-sm font-semibold">{notice.title}</p>
              <p className="text-brand-muted text-[11px]">{noticeMeta(notice)}</p>
            </div>
          </li>
        ))}
      </ul>
    </WidgetCard>
  );
}
