'use client';

// 공지 화면의 선택·작성 패널 상태와 서버 저장 후 Query 캐시 갱신을 관리합니다.
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createNotice,
  deleteNotice,
  setNoticePinned,
  updateNotice,
} from '@/entities/notice/api/notice-actions';
import { getNoticeBoard } from '@/entities/notice/api/get-notice-board';
import { noticeBoardQueryKey } from '@/entities/notice/model/notice-query';
import type { NoticeBoardData, NoticeFormValues } from '@/entities/notice';

interface UseNoticeBoardStateParams {
  initialData: NoticeBoardData;
  workspaceId: string;
}

export function useNoticeBoardState({ initialData, workspaceId }: UseNoticeBoardStateParams) {
  const queryClient = useQueryClient();
  const { data = initialData, isPending } = useQuery({
    queryKey: noticeBoardQueryKey(workspaceId),
    queryFn: () => getNoticeBoard(workspaceId),
    initialData,
  });
  const [selectedNoticeId, setSelectedNoticeId] = useState<string | null>(
    () => initialData.notices[0]?.id ?? null,
  );
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  const selectedNotice =
    data.notices.find((notice) => notice.id === selectedNoticeId) ?? data.notices[0] ?? null;
  const editingNotice = data.notices.find((notice) => notice.id === editingNoticeId) ?? null;

  const refreshNoticeBoard = async () => {
    await queryClient.invalidateQueries({ queryKey: noticeBoardQueryKey(workspaceId) });
  };

  const createMutation = useMutation({ mutationFn: createNotice });
  const updateMutation = useMutation({ mutationFn: updateNotice });
  const deleteMutation = useMutation({ mutationFn: deleteNotice });
  const pinMutation = useMutation({ mutationFn: setNoticePinned });

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

  const submitNotice = async (values: NoticeFormValues) => {
    const trimmedTitle = values.title.trim();
    const trimmedContent = values.content.trim();

    if (!trimmedTitle || !trimmedContent) {
      return;
    }

    try {
      if (editingNoticeId) {
        await updateMutation.mutateAsync({
          workspaceId,
          noticeId: editingNoticeId,
          title: trimmedTitle,
          content: trimmedContent,
        });
        setSelectedNoticeId(editingNoticeId);
      } else {
        const createdNotice = await createMutation.mutateAsync({
          workspaceId,
          title: trimmedTitle,
          content: trimmedContent,
        });
        setSelectedNoticeId(createdNotice.id);
      }

      await refreshNoticeBoard();
      closeComposer();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '공지 저장에 실패했습니다.');
    }
  };

  const removeNotice = async (noticeId: string) => {
    try {
      await deleteMutation.mutateAsync({ workspaceId, noticeId });
      await refreshNoticeBoard();

      if (selectedNoticeId === noticeId) {
        setSelectedNoticeId(null);
      }

      if (editingNoticeId === noticeId) {
        closeComposer();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '공지 삭제에 실패했습니다.');
    }
  };

  const togglePinned = async (noticeId: string) => {
    const notice = data.notices.find((item) => item.id === noticeId);

    if (!notice) return;

    try {
      await pinMutation.mutateAsync({ workspaceId, noticeId, isPinned: !notice.isPinned });
      await refreshNoticeBoard();
      setSelectedNoticeId(noticeId);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '공지 고정 상태 변경에 실패했습니다.');
    }
  };

  return {
    notices: data.notices,
    viewer: data.viewer,
    selectedNotice,
    editingNotice,
    isComposerOpen,
    openCreateComposer,
    openEditComposer,
    closeComposer,
    selectNotice: setSelectedNoticeId,
    submitNotice,
    deleteNotice: removeNotice,
    togglePinned,
    isPending,
    isSaving:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending ||
      pinMutation.isPending,
  };
}
