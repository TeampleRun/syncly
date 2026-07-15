'use server';

// 워크스페이스 멤버 권한으로 회의록을 저장하고, 작성자는 현재 로그인 사용자로 고정합니다.
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getCurrentUserId } from '@/shared/api/supabase/current-user';
import { createSupabaseServerClient } from '@/shared/api/supabase/server';

import { toMeetingNoteInsert } from '../model/meeting-note.mapper';
import { meetingNoteContentSchema } from '../model/meeting-note.schema';

export type MeetingNoteActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; message: string };

const createMeetingNoteSchema = meetingNoteContentSchema.extend({
  workspaceId: z.guid(),
});

export async function createMeetingNote(
  input: z.input<typeof createMeetingNoteSchema>,
): Promise<MeetingNoteActionResult<{ id: string }>> {
  const parsed = createMeetingNoteSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? '입력값이 올바르지 않습니다.' };
  }

  const value = parsed.data;
  const supabase = await createSupabaseServerClient();
  const currentUserId = await getCurrentUserId();

  const { data: membership, error: memberError } = await supabase
    .from('workspace_members')
    .select('user_id')
    .eq('workspace_id', value.workspaceId)
    .eq('user_id', currentUserId)
    .maybeSingle();

  if (memberError) {
    console.error('[meeting-note/createMeetingNote] 멤버 확인 실패:', memberError);
    return { ok: false, message: '워크스페이스 멤버 정보를 확인하지 못했습니다.' };
  }

  if (!membership) {
    return { ok: false, message: '워크스페이스 멤버만 회의록을 작성할 수 있습니다.' };
  }

  const { data, error } = await supabase
    .from('meeting_notes')
    .insert(
      toMeetingNoteInsert({
        workspaceId: value.workspaceId,
        authorId: currentUserId,
        title: value.title,
        meetingDate: value.meetingDate,
        participantIds: value.participantIds,
        decisions: value.decisions,
        followUpActions: value.followUpActions,
      }),
    )
    .select('id')
    .single();

  if (error) {
    console.error('[meeting-note/createMeetingNote] 저장 실패:', error);
    return { ok: false, message: '회의록 저장에 실패했습니다. 잠시 후 다시 시도해주세요.' };
  }

  revalidatePath(`/workspaces/${value.workspaceId}/meeting-notes`);
  revalidatePath(`/workspaces/${value.workspaceId}/dashboard`);

  return { ok: true, data: { id: data.id } };
}
