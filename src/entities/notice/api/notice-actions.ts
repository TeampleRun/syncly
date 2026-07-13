'use server';

// 공지 작성·수정·삭제·고정 변경을 입력 검증과 워크스페이스 권한 확인 후 처리합니다.
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getCurrentUserId } from '@/shared/api/supabase/current-user';
import { createSupabaseServerClient } from '@/shared/api/supabase/server';

const uuidSchema = z.guid();
const noticeContentSchema = z.object({
  title: z.string().trim().min(1, '공지 제목을 입력해주세요.').max(120),
  content: z.string().trim().min(1, '공지 내용을 입력해주세요.').max(10_000),
});

type WorkspaceMember = { user_id: string; role: 'owner' | 'member' };

function revalidateNoticePages(workspaceId: string): void {
  revalidatePath(`/workspaces/${workspaceId}/notices`);
  revalidatePath(`/workspaces/${workspaceId}/dashboard`);
}

async function getCurrentWorkspaceMember(workspaceId: string): Promise<{
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
  member: WorkspaceMember;
}> {
  const supabase = await createSupabaseServerClient();
  const currentUserId = await getCurrentUserId();
  const { data, error } = await supabase
    .from('workspace_members')
    .select('user_id, role')
    .eq('workspace_id', workspaceId)
    .eq('user_id', currentUserId)
    .maybeSingle();

  if (error) {
    throw new Error(`워크스페이스 멤버 확인에 실패했습니다: ${error.message}`);
  }

  if (!data) {
    throw new Error('워크스페이스 멤버만 공지를 관리할 수 있습니다.');
  }

  return { supabase, member: data };
}

async function getEditableAnnouncement(input: { workspaceId: string; noticeId: string }) {
  const { supabase, member } = await getCurrentWorkspaceMember(input.workspaceId);
  const { data: notice, error } = await supabase
    .from('announcements')
    .select('id, author_id')
    .eq('id', input.noticeId)
    .eq('workspace_id', input.workspaceId)
    .maybeSingle();

  if (error) {
    throw new Error(`공지 조회에 실패했습니다: ${error.message}`);
  }

  if (!notice) {
    throw new Error('공지를 찾을 수 없습니다.');
  }

  if (member.role !== 'owner' && notice.author_id !== member.user_id) {
    throw new Error('작성자 또는 워크스페이스 소유자만 공지를 수정하거나 삭제할 수 있습니다.');
  }

  return { supabase, member, notice };
}

export async function createNotice(input: {
  workspaceId: string;
  title: string;
  content: string;
}): Promise<{ id: string }> {
  const value = z.object({ workspaceId: uuidSchema }).merge(noticeContentSchema).parse(input);
  const { supabase, member } = await getCurrentWorkspaceMember(value.workspaceId);
  const { data, error } = await supabase
    .from('announcements')
    .insert({
      workspace_id: value.workspaceId,
      author_id: member.user_id,
      title: value.title,
      content: value.content,
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(`공지 등록에 실패했습니다: ${error.message}`);
  }

  revalidateNoticePages(value.workspaceId);
  return { id: data.id };
}

export async function updateNotice(input: {
  workspaceId: string;
  noticeId: string;
  title: string;
  content: string;
}): Promise<void> {
  const value = z
    .object({ workspaceId: uuidSchema, noticeId: uuidSchema })
    .merge(noticeContentSchema)
    .parse(input);
  const { supabase } = await getEditableAnnouncement(value);
  const { error } = await supabase
    .from('announcements')
    .update({ title: value.title, content: value.content })
    .eq('id', value.noticeId)
    .eq('workspace_id', value.workspaceId);

  if (error) {
    throw new Error(`공지 수정에 실패했습니다: ${error.message}`);
  }

  revalidateNoticePages(value.workspaceId);
}

export async function deleteNotice(input: {
  workspaceId: string;
  noticeId: string;
}): Promise<void> {
  const value = z.object({ workspaceId: uuidSchema, noticeId: uuidSchema }).parse(input);
  const { supabase } = await getEditableAnnouncement(value);
  const { error } = await supabase
    .from('announcements')
    .delete()
    .eq('id', value.noticeId)
    .eq('workspace_id', value.workspaceId);

  if (error) {
    throw new Error(`공지 삭제에 실패했습니다: ${error.message}`);
  }

  revalidateNoticePages(value.workspaceId);
}

export async function setNoticePinned(input: {
  workspaceId: string;
  noticeId: string;
  isPinned: boolean;
}): Promise<void> {
  const value = z
    .object({ workspaceId: uuidSchema, noticeId: uuidSchema, isPinned: z.boolean() })
    .parse(input);
  const { supabase, member } = await getCurrentWorkspaceMember(value.workspaceId);

  if (member.role !== 'owner') {
    throw new Error('워크스페이스 소유자만 공지를 고정할 수 있습니다.');
  }

  const { error } = await supabase
    .from('announcements')
    .update({ is_pinned: value.isPinned })
    .eq('id', value.noticeId)
    .eq('workspace_id', value.workspaceId);

  if (error) {
    throw new Error(`공지 고정 상태 변경에 실패했습니다: ${error.message}`);
  }

  revalidateNoticePages(value.workspaceId);
}
