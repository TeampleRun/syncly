'use server';

// 수정 페이지에서 단건 회의록과 참석자·작성자 이름을 함께 조회합니다.
import { z } from 'zod';
import { createSupabaseServerClient } from '@/shared/api/supabase/server';

import {
  MEETING_NOTE_SELECT_QUERY,
  toMeetingNote,
  type MeetingNoteQueryRow,
} from '../model/meeting-note.mapper';
import type { MeetingNote } from '../model/meeting-note.types';

const idSchema = z.guid();

export async function getMeetingNote(
  workspaceId: string,
  meetingNoteId: string,
): Promise<MeetingNote | null> {
  const parsedWorkspaceId = idSchema.parse(workspaceId);
  const parsedNoteId = idSchema.parse(meetingNoteId);
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('meeting_notes')
    .select(MEETING_NOTE_SELECT_QUERY)
    .eq('id', parsedNoteId)
    .eq('workspace_id', parsedWorkspaceId)
    .maybeSingle();

  if (error) throw new Error(`회의록 조회에 실패했습니다: ${error.message}`);
  if (!data) return null;

  const row = data as MeetingNoteQueryRow;
  const profileIds = [
    ...new Set([...row.participants, ...(row.author_id ? [row.author_id] : [])]),
  ];
  const { data: profiles, error: profileError } = profileIds.length
    ? await supabase.from('profiles').select('id, real_name').in('id', profileIds)
    : { data: [], error: null };

  if (profileError) throw new Error(`참석자 정보를 불러오지 못했습니다: ${profileError.message}`);

  const profileNameById = new Map((profiles ?? []).map((profile) => [profile.id, profile.real_name]));

  return toMeetingNote(row, profileNameById);
}
