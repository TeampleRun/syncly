// 회의록 한 줄 — 문서 아이콘 + 제목 + 작성일. 리스트(<ul>)는 소비 측에서 감싼다.
import { FileText } from 'lucide-react';

import type { MeetingNote } from '../model/meeting-note';

export function MeetingNoteRow({ note }: { note: MeetingNote }) {
  return (
    <li className="flex items-start gap-2">
      <FileText className="text-brand-muted mt-0.5 size-4 shrink-0" />
      <div className="min-w-0">
        <p className="text-brand-ink truncate text-sm font-semibold">{note.title}</p>
        <p className="text-brand-muted text-[11px]">{note.date}</p>
      </div>
    </li>
  );
}
