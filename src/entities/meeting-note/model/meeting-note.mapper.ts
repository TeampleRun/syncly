import { getAvatarColor } from '@/shared/lib/avatar-color';
import type { GenericTablesInsert, GenericTablesUpdate } from '@/shared/model/supabase.types';

import type { MeetingNoteRow } from './meeting-note.db.types';
import type { MeetingNote, MeetingNoteParticipant } from './meeting-note.types';

// 조회 시 실제로 select 하는 컬럼만 담는 서브셋 타입 (task 도메인 TaskQueryRow와 동일 패턴)
export type MeetingNoteQueryRow = Pick<
  MeetingNoteRow,
  | 'id'
  | 'workspace_id'
  | 'author_id'
  | 'title'
  | 'meeting_at'
  | 'participants'
  | 'decisions'
  | 'follow_up_actions'
>;

export const MEETING_NOTE_SELECT_QUERY =
  'id, workspace_id, author_id, title, meeting_at, participants, decisions, follow_up_actions';

const KST_TIME_ZONE = 'Asia/Seoul';

// DB의 meeting_at(timestamptz) → UI 표기용 KST 날짜(YYYY-MM-DD)
export function toMeetingDate(meetingAt: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: KST_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(meetingAt));

  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  if (!year || !month || !day) {
    return '';
  }

  return `${year}-${month}-${day}`;
}

// UI 날짜(YYYY-MM-DD) → DB 저장용 KST 자정 ISO 문자열
export function toMeetingAt(meetingDate: string): string {
  return `${meetingDate}T00:00:00+09:00`;
}

function toParticipant(userId: string, profileNameById: Map<string, string>): MeetingNoteParticipant {
  const name = profileNameById.get(userId) ?? '알 수 없음';

  return {
    id: userId,
    name,
    initial: name.slice(0, 1),
    color: getAvatarColor(userId),
  };
}

export function toMeetingNote(
  row: MeetingNoteQueryRow,
  profileNameById: Map<string, string>,
): MeetingNote {
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    authorId: row.author_id,
    title: row.title,
    meetingDate: toMeetingDate(row.meeting_at),
    participants: row.participants.map((userId) => toParticipant(userId, profileNameById)),
    decisions: row.decisions,
    followUpActions: row.follow_up_actions,
  };
}

export function toMeetingNoteInsert(params: {
  workspaceId: string;
  authorId: string;
  title: string;
  meetingDate: string;
  participantIds: string[];
  decisions: string[];
  followUpActions: string[];
}): GenericTablesInsert<'meeting_notes'> {
  return {
    workspace_id: params.workspaceId,
    author_id: params.authorId,
    title: params.title,
    meeting_at: toMeetingAt(params.meetingDate),
    participants: params.participantIds,
    decisions: params.decisions,
    follow_up_actions: params.followUpActions,
  };
}

export function toMeetingNoteUpdate(params: {
  title: string;
  meetingDate: string;
  participantIds: string[];
  decisions: string[];
  followUpActions: string[];
}): GenericTablesUpdate<'meeting_notes'> {
  return {
    title: params.title,
    meeting_at: toMeetingAt(params.meetingDate),
    participants: params.participantIds,
    decisions: params.decisions,
    follow_up_actions: params.followUpActions,
  };
}
