'use server';

// 작성자 또는 워크스페이스 소유자만 회의록을 삭제할 수 있습니다.
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import type { MeetingNoteActionResult } from './create-meeting-note';
import { authorizeMeetingNoteMutation } from './shared';

const deleteMeetingNoteSchema = z.object({
  workspaceId: z.guid(),
  meetingNoteId: z.guid(),
});

export async function deleteMeetingNote(
  input: z.input<typeof deleteMeetingNoteSchema>,
): Promise<MeetingNoteActionResult<void>> {
  const parsed = deleteMeetingNoteSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: '입력값이 올바르지 않습니다.' };
  }

  const value = parsed.data;
  const authorized = await authorizeMeetingNoteMutation(value);

  if (!authorized.ok) {
    return authorized;
  }

  const { error } = await authorized.context.supabase
    .from('meeting_notes')
    .delete()
    .eq('id', value.meetingNoteId)
    .eq('workspace_id', value.workspaceId);

  if (error) {
    console.error('[meeting-note/deleteMeetingNote] 삭제 실패:', error);
    return { ok: false, message: '회의록 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.' };
  }

  revalidatePath(`/workspaces/${value.workspaceId}/meeting-notes`);
  revalidatePath(`/workspaces/${value.workspaceId}/dashboard`);

  return { ok: true, data: undefined };
}
