'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { MeetingNoteCard } from '@/entities/meeting-note';
import type { MeetingNote } from '@/entities/meeting-note';

interface MeetingNotesListProps {
  workspaceId: string;
  meetingNotes: MeetingNote[];
}

export function MeetingNotesList({ workspaceId, meetingNotes }: MeetingNotesListProps) {
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

      {meetingNotes.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-[#d9deee] bg-white px-6 py-16 text-center">
          <p className="text-brand-ink text-[17px] font-semibold">아직 작성된 회의록이 없습니다.</p>
          <p className="text-brand-muted mt-2 text-[14px]">
            첫 회의록을 작성해 팀의 결정사항을 기록해보세요.
          </p>
        </div>
      ) : (
        <div className="space-y-[14px]">
          {meetingNotes.map((meetingNote) => (
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
      )}
    </section>
  );
}
