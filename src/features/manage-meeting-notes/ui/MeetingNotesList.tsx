'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { MeetingNoteCard } from '@/entities/meeting-note';
import type { MeetingNote } from '@/entities/meeting-note';
import { useMeetingNotesStore } from '../model/use-meeting-notes-store';

interface MeetingNotesListProps {
  workspaceId: string;
  meetingNotes: MeetingNote[];
}

export function MeetingNotesList({ workspaceId, meetingNotes }: MeetingNotesListProps) {
  const storedMeetingNotes = useMeetingNotesStore(
    (state) => state.meetingNotesByWorkspaceId[workspaceId],
  );
  const initializeWorkspace = useMeetingNotesStore((state) => state.initializeWorkspace);

  useEffect(() => {
    // 서버 연동 전 단계라, 라우트 진입 시 워크스페이스별 초기 mock 데이터를 store에 주입합니다.
    initializeWorkspace(workspaceId, meetingNotes);
  }, [initializeWorkspace, meetingNotes, workspaceId]);

  const displayedMeetingNotes = storedMeetingNotes ?? meetingNotes;
  const [expandedMeetingNoteId, setExpandedMeetingNoteId] = useState<string | null>(null);

  return (
    <section className="max-w-[714px]">
      <div className="mb-[26px] flex items-center justify-between gap-4">
        <h1 className="text-brand-ink text-[36px] font-extrabold tracking-[-0.04em]">회의록</h1>
        <Link
          href={`/workspaces/${workspaceId}/meeting-notes/new`}
          className="bg-brand inline-flex h-12 items-center gap-2 rounded-full px-5 text-[16px] font-bold text-white shadow-[0_10px_24px_rgba(91,78,232,0.24)] transition hover:brightness-105"
        >
          <Plus className="size-4" />
          회의록 작성
        </Link>
      </div>

      <div className="space-y-[14px]">
        {displayedMeetingNotes.map((meetingNote) => (
          <MeetingNoteCard
            key={meetingNote.id}
            meetingNote={meetingNote}
            isExpanded={expandedMeetingNoteId === meetingNote.id}
            onClick={() =>
              setExpandedMeetingNoteId((current) =>
                current === meetingNote.id ? null : meetingNote.id,
              )
            }
          />
        ))}
      </div>
    </section>
  );
}
