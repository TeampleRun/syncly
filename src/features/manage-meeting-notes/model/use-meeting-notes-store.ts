'use client';

import { create } from 'zustand';
import type { MeetingNote } from '@/entities/meeting-note';

interface MeetingNotesStore {
  meetingNotesByWorkspaceId: Record<string, MeetingNote[]>;
  initializeWorkspace: (workspaceId: string, meetingNotes: MeetingNote[]) => void;
  addMeetingNote: (workspaceId: string, meetingNote: MeetingNote) => void;
}

export const useMeetingNotesStore = create<MeetingNotesStore>((set) => ({
  meetingNotesByWorkspaceId: {},
  initializeWorkspace: (workspaceId, meetingNotes) =>
    set((state) => {
      // 최초 진입 시에만 mock 데이터를 넣고, 이후 작성한 항목은 유지합니다.
      if (state.meetingNotesByWorkspaceId[workspaceId]) {
        return state;
      }

      return {
        meetingNotesByWorkspaceId: {
          ...state.meetingNotesByWorkspaceId,
          [workspaceId]: meetingNotes,
        },
      };
    }),
  addMeetingNote: (workspaceId, meetingNote) =>
    set((state) => ({
      meetingNotesByWorkspaceId: {
        ...state.meetingNotesByWorkspaceId,
        // 방금 작성한 회의록이 목록에서 바로 보이도록 맨 앞에 추가합니다.
        [workspaceId]: [meetingNote, ...(state.meetingNotesByWorkspaceId[workspaceId] ?? [])],
      },
    })),
}));
