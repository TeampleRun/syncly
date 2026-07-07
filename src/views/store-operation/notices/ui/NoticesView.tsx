'use client';

import { Plus } from 'lucide-react';
import { mockNotices } from '@/entities/notice';
import { mockCurrentWorkspaceMember } from '@/entities/workspace-member';
import {
  NoticeComposer,
  NoticeDetailPanel,
  NoticeList,
  useNoticeBoardState,
} from '@/features/manage-notices';

interface NoticesViewProps {
  workspaceId: string;
}

export function NoticesView({ workspaceId }: NoticesViewProps) {
  const {
    notices,
    selectedNotice,
    editingNotice,
    isComposerOpen,
    openCreateComposer,
    openEditComposer,
    closeComposer,
    selectNotice,
    submitNotice,
    deleteNotice,
    togglePinned,
  } = useNoticeBoardState({
    initialNotices: mockNotices,
    workspaceId,
    authorName: mockCurrentWorkspaceMember.workspaceNickname,
  });

  return (
    <section>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-950">공지</h1>
        <button
          type="button"
          onClick={openCreateComposer}
          className="flex h-12 items-center gap-2 rounded-2xl bg-[var(--color-brand)] px-5 text-base font-bold text-white shadow-sm hover:bg-indigo-500"
        >
          <Plus className="h-5 w-5" aria-hidden="true" />
          공지 작성
        </button>
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          {isComposerOpen ? (
            <NoticeComposer
              key={editingNotice?.id ?? 'new-notice'}
              editingNotice={editingNotice}
              onSubmit={submitNotice}
              onCancel={closeComposer}
            />
          ) : null}

          <NoticeList
            notices={notices}
            selectedNoticeId={selectedNotice?.id ?? null}
            onSelectNotice={selectNotice}
            onEditNotice={openEditComposer}
            onDeleteNotice={deleteNotice}
            onTogglePinned={togglePinned}
          />
        </div>

        <div className="sticky top-6 hidden xl:block">
          <NoticeDetailPanel notice={selectedNotice} />
        </div>
      </div>
    </section>
  );
}
