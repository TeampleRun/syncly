'use server';

// 작성자 또는 워크스페이스 소유자만 회의록을 수정할 수 있습니다.
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { toMeetingNoteUpdate } from '../model/meeting-note.mapper';
import { meetingNoteContentSchema } from '../model/meeting-note.schema';
import type { MeetingNoteActionResult } from './create-meeting-note';
import { authorizeMeetingNoteMutation } from './shared';

const updateMeetingNoteSchema = meetingNoteContentSchema.extend({
  workspaceId: z.guid(),
  meetingNoteId: z.guid(),
});

export async function updateMeetingNote(
  input: z.input<typeof updateMeetingNoteSchema>,
): Promise<MeetingNoteActionResult<{ id: string }>> {
  const parsed = updateMeetingNoteSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? '입력값이 올바르지 않습니다.' };
  }

  const value = parsed.data;
  const authorized = await authorizeMeetingNoteMutation({
    workspaceId: value.workspaceId,
    meetingNoteId: value.meetingNoteId,
  });

  if (!authorized.ok) {
    return authorized;
  }

  const { error } = await authorized.context.supabase
    .from('meeting_notes')
    .update(
      toMeetingNoteUpdate({
        title: value.title,
        meetingDate: value.meetingDate,
        participantIds: value.participantIds,
        decisions: value.decisions,
        followUpActions: value.followUpActions,
      }),
    )
    .eq('id', value.meetingNoteId)
    .eq('workspace_id', value.workspaceId);

  if (error) {
    console.error('[meeting-note/updateMeetingNote] 수정 실패:', error);
    return { ok: false, message: '회의록 수정에 실패했습니다. 잠시 후 다시 시도해주세요.' };
  }

  revalidatePath(`/workspaces/${value.workspaceId}/meeting-notes`);
  revalidatePath(`/workspaces/${value.workspaceId}/dashboard`);

  return { ok: true, data: { id: value.meetingNoteId } };
}
