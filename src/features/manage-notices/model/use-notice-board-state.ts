'use client';

// 워크스페이스 공지사항 게시판의 목록 정렬, 선택, 작성/수정, 삭제, 고정 상태를 관리합니다.
import { useState } from 'react';
import type { Notice, NoticeFormValues } from '@/entities/notice';

interface UseNoticeBoardStateParams {
  initialNotices: Notice[];
  workspaceId: string;
  authorName: string;
}

function sortNotices(notices: Notice[]) {
  return [...notices].sort((first, second) => {
    if (first.isPinned !== second.isPinned) {
      return first.isPinned ? -1 : 1;
    }

    return second.createdAt.localeCompare(first.createdAt);
  });
}

function createNoticeId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `notice-${crypto.randomUUID()}`;
  }

  return `notice-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function createTodayLabel() {
  return new Date().toISOString().slice(0, 10);
}

export function useNoticeBoardState({
  initialNotices,
  workspaceId,
  authorName,
}: UseNoticeBoardStateParams) {
  const [notices, setNotices] = useState(() => sortNotices(initialNotices));
  const [selectedNoticeId, setSelectedNoticeId] = useState(
    () => sortNotices(initialNotices)[0]?.id ?? null,
  );
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  const selectedNotice = notices.find((notice) => notice.id === selectedNoticeId) ?? null;
  const editingNotice = notices.find((notice) => notice.id === editingNoticeId) ?? null;

  const openCreateComposer = () => {
    setEditingNoticeId(null);
    setIsComposerOpen(true);
  };

  const openEditComposer = (noticeId: string) => {
    setSelectedNoticeId(noticeId);
    setEditingNoticeId(noticeId);
    setIsComposerOpen(true);
  };

  const closeComposer = () => {
    setEditingNoticeId(null);
    setIsComposerOpen(false);
  };

  const submitNotice = (values: NoticeFormValues) => {
    const trimmedTitle = values.title.trim();
    const trimmedContent = values.content.trim();

    if (!trimmedTitle || !trimmedContent) {
      return;
    }

    if (editingNoticeId) {
      setNotices((currentNotices) =>
        currentNotices.map((notice) =>
          notice.id === editingNoticeId
            ? { ...notice, title: trimmedTitle, content: trimmedContent }
            : notice,
        ),
      );
      setSelectedNoticeId(editingNoticeId);
      closeComposer();
      return;
    }

    const nextNotice: Notice = {
      id: createNoticeId(),
      workspaceId,
      title: trimmedTitle,
      content: trimmedContent,
      authorName,
      createdAt: createTodayLabel(),
      isPinned: false,
    };

    setNotices((currentNotices) => sortNotices([nextNotice, ...currentNotices]));
    setSelectedNoticeId(nextNotice.id);
    closeComposer();
  };

  const deleteNotice = (noticeId: string) => {
    const nextNotices = sortNotices(notices.filter((notice) => notice.id !== noticeId));

    setNotices(nextNotices);

    if (selectedNoticeId === noticeId) {
      setSelectedNoticeId(nextNotices[0]?.id ?? null);
    }

    if (editingNoticeId === noticeId) {
      closeComposer();
    }
  };

  const togglePinned = (noticeId: string) => {
    setNotices((currentNotices) =>
      sortNotices(
        currentNotices.map((notice) =>
          notice.id === noticeId ? { ...notice, isPinned: !notice.isPinned } : notice,
        ),
      ),
    );
    setSelectedNoticeId(noticeId);
  };

  return {
    notices,
    selectedNotice,
    editingNotice,
    isComposerOpen,
    openCreateComposer,
    openEditComposer,
    closeComposer,
    selectNotice: setSelectedNoticeId,
    submitNotice,
    deleteNotice,
    togglePinned,
  };
}
