'use client';

// 최근 회의록 위젯 — 타일 크기에 따라 밀도가 다른 변형을 렌더
//  · sm: 가장 최근 회의록 1건(제목만)
//  · md: 리스트(제목 + 작성일)
//  · lg: 총 개수 + 리스트(제목 + 본문 미리보기 + 작성일)
import { FileText } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import { getMeetingNotes, meetingNotesQueryKey } from '@/entities/meeting-note';
import type { WidgetSize } from '@/shared/dashboard/lib/widget-size';
import { WidgetCard, WidgetCardAction, WidgetCardHeader } from '@/shared/dashboard/ui/widget-card';

const header = (
  <WidgetCardHeader title="최근 회의록" action={<WidgetCardAction>전체 보기</WidgetCardAction>} />
);
interface RecentNotesProps {
  workspaceId: string;
  size?: WidgetSize;
}

export default function RecentNotes({ workspaceId, size = 'md' }: RecentNotesProps) {
  const { data, isError, isPending } = useQuery({
    queryKey: meetingNotesQueryKey(workspaceId),
    queryFn: () => getMeetingNotes(workspaceId),
  });
  const meetingNotes = data?.meetingNotes ?? [];

  if (isPending || isError || meetingNotes.length === 0) {
    return (
      <WidgetCard>
        {header}
        <div className="text-brand-muted flex min-h-0 flex-1 items-center justify-center text-center text-sm">
          {isPending
            ? '회의록을 불러오는 중입니다.'
            : isError
              ? '회의록을 불러오지 못했습니다.'
              : '작성된 회의록이 없습니다.'}
        </div>
      </WidgetCard>
    );
  }

  if (size === 'sm') {
    const latest = meetingNotes[0];
    return (
      <WidgetCard>
        {header}
        <div className="flex items-center gap-2">
          <FileText className="text-brand-muted size-4 shrink-0" />
          <span className="text-brand-ink truncate text-sm font-semibold">{latest.title}</span>
        </div>
      </WidgetCard>
    );
  }

  if (size === 'lg') {
    return (
      <WidgetCard>
        {header}
        <p className="text-brand-muted mb-2 text-xs">총 {meetingNotes.length}개의 회의록</p>
        <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
          {meetingNotes.map((note) => (
            <li key={note.id} className="bg-brand-surface flex items-start gap-2 rounded-xl p-3">
              <FileText className="text-brand-muted mt-0.5 size-4 shrink-0" />
              <div className="min-w-0">
                <p className="text-brand-ink truncate text-sm font-semibold">{note.title}</p>
                <p className="text-brand-muted truncate text-xs">{note.decisions[0]}</p>
                <p className="text-brand-muted mt-0.5 text-[11px]">{note.meetingDate}</p>
              </div>
            </li>
          ))}
        </ul>
      </WidgetCard>
    );
  }

  // md — 리스트(제목 + 작성일)
  return (
    <WidgetCard>
      {header}
      <ul className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
        {meetingNotes.map((note) => (
          <li key={note.id} className="flex items-start gap-2">
            <FileText className="text-brand-muted mt-0.5 size-4 shrink-0" />
            <div className="min-w-0">
              <p className="text-brand-ink truncate text-sm font-semibold">{note.title}</p>
              <p className="text-brand-muted text-[11px]">{note.meetingDate}</p>
            </div>
          </li>
        ))}
      </ul>
    </WidgetCard>
  );
}
