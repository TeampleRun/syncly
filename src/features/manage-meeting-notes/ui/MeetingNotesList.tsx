'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { MeetingNoteCard, deleteMeetingNote, meetingNotesQueryKey } from '@/entities/meeting-note';
import type { MeetingNote, MeetingNoteViewer } from '@/entities/meeting-note';

interface MeetingNotesListProps {
  workspaceId: string;
  meetingNotes: MeetingNote[];
  viewer: MeetingNoteViewer | null;
}

export function MeetingNotesList({ workspaceId, meetingNotes, viewer }: MeetingNotesListProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [expandedMeetingNoteId, setExpandedMeetingNoteId] = useState<string | null>(null);
  const [openMenuMeetingNoteId, setOpenMenuMeetingNoteId] = useState<string | null>(null);
  const deleteMutation = useMutation({ mutationFn: deleteMeetingNote });

  const canManage = (meetingNote: MeetingNote) =>
    viewer?.role === 'owner' || (!!viewer && meetingNote.authorId === viewer.userId);

  const handleDelete = async (meetingNoteId: string) => {
    setOpenMenuMeetingNoteId(null);

    if (deleteMutation.isPending) {
      return;
    }

    if (!window.confirm('이 회의록을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const result = await deleteMutation.mutateAsync({ workspaceId, meetingNoteId });

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      await queryClient.invalidateQueries({ queryKey: meetingNotesQueryKey(workspaceId) });
      // 목록 페이지는 서버 컴포넌트라, 삭제된 항목이 사라지도록 서버 데이터를 다시 불러온다.
      router.refresh();
    } catch {
      toast.error('회의록 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <section className="max-w-[714px]">
      <div className="mb-[26px] flex items-center justify-between gap-4">
        <h1 className="workspace-page-title">회의록</h1>
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
              canManage={canManage(meetingNote)}
              isMenuOpen={openMenuMeetingNoteId === meetingNote.id}
              onToggleMenu={() =>
                setOpenMenuMeetingNoteId((current) =>
                  current === meetingNote.id ? null : meetingNote.id,
                )
              }
              onEdit={() => {
                setOpenMenuMeetingNoteId(null);
                router.push(`/workspaces/${workspaceId}/meeting-notes/${meetingNote.id}/edit`);
              }}
              onDelete={() => void handleDelete(meetingNote.id)}
              isDeleting={deleteMutation.isPending}
            />
          ))}
        </div>
      )}
    </section>
  );
}
