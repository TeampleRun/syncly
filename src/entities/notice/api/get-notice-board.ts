'use server';

// 워크스페이스 공지와 현재 사용자의 역할을 함께 조회해 공지 화면·위젯의 데이터 기준을 통일합니다.
import { z } from 'zod';
import { getCurrentUserId } from '@/shared/api/supabase/current-user';
import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import type { Notice, NoticeBoardData } from '../model/notice.types';

const workspaceIdSchema = z.guid();

function toCreatedAtLabel(value: string): string {
  return value.slice(0, 10);
}

export async function getNoticeBoard(workspaceId: string): Promise<NoticeBoardData> {
  const parsedWorkspaceId = workspaceIdSchema.parse(workspaceId);
  const supabase = await createSupabaseServerClient();
  const currentUserId = await getCurrentUserId();

  const [
    { data: announcements, error: announcementError },
    { data: membership, error: memberError },
  ] = await Promise.all([
    supabase
      .from('announcements')
      .select('id, workspace_id, author_id, title, content, is_pinned, created_at')
      .eq('workspace_id', parsedWorkspaceId)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false }),
    supabase
      .from('workspace_members')
      .select('user_id, role')
      .eq('workspace_id', parsedWorkspaceId)
      .eq('user_id', currentUserId)
      .maybeSingle(),
  ]);

  if (announcementError) {
    throw new Error(`공지 조회에 실패했습니다: ${announcementError.message}`);
  }

  if (memberError) {
    throw new Error(`현재 멤버 조회에 실패했습니다: ${memberError.message}`);
  }

  const authorIds = [
    ...new Set(
      (announcements ?? []).flatMap((notice) => (notice.author_id ? [notice.author_id] : [])),
    ),
  ];
  const { data: profiles, error: profileError } = authorIds.length
    ? await supabase.from('profiles').select('id, real_name').in('id', authorIds)
    : { data: [], error: null };

  if (profileError) {
    throw new Error(`공지 작성자 조회에 실패했습니다: ${profileError.message}`);
  }

  const profileNameById = new Map(
    (profiles ?? []).map((profile) => [profile.id, profile.real_name]),
  );
  const notices: Notice[] = (announcements ?? []).map((notice) => ({
    id: notice.id,
    workspaceId: notice.workspace_id,
    authorId: notice.author_id,
    title: notice.title,
    content: notice.content,
    authorName: notice.author_id
      ? (profileNameById.get(notice.author_id) ?? '알 수 없음')
      : '탈퇴한 사용자',
    createdAt: toCreatedAtLabel(notice.created_at),
    isPinned: notice.is_pinned,
  }));

  return {
    notices,
    viewer: membership
      ? {
          userId: membership.user_id,
          role: membership.role,
        }
      : null,
  };
}
