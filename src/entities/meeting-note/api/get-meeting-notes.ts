'use server';

// 워크스페이스 범위의 회의록과 참석자·작성자 이름을 함께 조회합니다.
import { z } from 'zod';
import { getCurrentUserId } from '@/shared/api/supabase/current-user';
import { createSupabaseServerClient } from '@/shared/api/supabase/server';

import {
  MEETING_NOTE_SELECT_QUERY,
  toMeetingNote,
  type MeetingNoteQueryRow,
} from '../model/meeting-note.mapper';
import type { MeetingNoteBoardData } from '../model/meeting-note.types';

const workspaceIdSchema = z.guid();

export async function getMeetingNotes(workspaceId: string): Promise<MeetingNoteBoardData> {
  const parsedWorkspaceId = workspaceIdSchema.parse(workspaceId);
  const supabase = await createSupabaseServerClient();
  const currentUserId = await getCurrentUserId();

  const [{ data: notes, error: notesError }, { data: membership, error: memberError }] =
    await Promise.all([
      supabase
        .from('meeting_notes')
        .select(MEETING_NOTE_SELECT_QUERY)
        .eq('workspace_id', parsedWorkspaceId)
        .order('meeting_at', { ascending: false }),
      supabase
        .from('workspace_members')
        .select('user_id, role')
        .eq('workspace_id', parsedWorkspaceId)
        .eq('user_id', currentUserId)
        .maybeSingle(),
    ]);

  if (notesError) throw new Error(`회의록 조회에 실패했습니다: ${notesError.message}`);
  if (memberError) throw new Error(`현재 멤버 조회에 실패했습니다: ${memberError.message}`);

  const rows = (notes ?? []) as MeetingNoteQueryRow[];

  // 참석자 + 작성자 이름을 한 번의 profiles 조회로 복원한다.
  const profileIds = [
    ...new Set(
      rows.flatMap((row) => [...row.participants, ...(row.author_id ? [row.author_id] : [])]),
    ),
  ];
  const { data: profiles, error: profileError } = profileIds.length
    ? await supabase.from('profiles').select('id, real_name').in('id', profileIds)
    : { data: [], error: null };

  if (profileError) throw new Error(`참석자 정보를 불러오지 못했습니다: ${profileError.message}`);

  const profileNameById = new Map((profiles ?? []).map((profile) => [profile.id, profile.real_name]));

  return {
    meetingNotes: rows.map((row) => toMeetingNote(row, profileNameById)),
    viewer: membership ? { userId: membership.user_id, role: membership.role } : null,
  };
}
