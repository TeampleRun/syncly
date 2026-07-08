export interface MeetingNoteParticipant {
  id: string;
  name: string;
  initial: string;
  color: string;
}

export interface MeetingNote {
  id: string;
  workspaceId: string;
  title: string;
  meetingDate: string;
  participants: MeetingNoteParticipant[];
  decisions: string[];
  followUpActions: string[];
}

export interface MeetingNoteFormValues {
  title: string;
  meetingDate: string;
  decisions: string;
  followUpActions: string;
}
