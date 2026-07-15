import type { GenericTablesInsert, GenericTablesUpdate } from '@/shared/model/supabase.types';

import type { MeetingNoteRow } from './meeting-note.db.types';
import type { MeetingNote, MeetingNoteParticipant } from './meeting-note.types';

// 참석자 아바타 색상은 DB에 저장하지 않고 userId 해시로 결정론적으로 재생성한다.
// 같은 참석자는 어느 카드에서든 항상 같은 색으로 보인다.
const PARTICIPANT_PALETTE = [
  '#FE9A00',
  '#00C950',
  '#615FFF',
  '#2B7FFF',
  '#00B8DB',
  '#FF6B6B',
] as const;

const KST_TIME_ZONE = 'Asia/Seoul';

export function getParticipantColor(seed: string): string {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return PARTICIPANT_PALETTE[hash % PARTICIPANT_PALETTE.length];
}

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
    color: getParticipantColor(userId),
  };
}

export function toMeetingNote(
  row: MeetingNoteRow,
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
