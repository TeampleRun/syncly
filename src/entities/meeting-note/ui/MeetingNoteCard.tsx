import { ArrowRight, Check } from 'lucide-react';
import type { KeyboardEvent } from 'react';
import type { MeetingNote } from '../model/meeting-note.types';

interface MeetingNoteCardProps {
  meetingNote: MeetingNote;
  isExpanded?: boolean;
  onClick?: () => void;
}

export function MeetingNoteCard({
  meetingNote,
  isExpanded = false,
  onClick,
}: MeetingNoteCardProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className="block w-full rounded-[24px] text-left"
      aria-expanded={isExpanded}
      aria-label={`${meetingNote.title} 회의록 상세 ${isExpanded ? '닫기' : '열기'}`}
    >
      <article className="rounded-[24px] border border-[#ebeef7] bg-white px-[22px] py-[21px] shadow-[0_10px_30px_rgba(91,78,232,0.06)] transition hover:border-[rgba(91,78,232,0.16)]">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <h3 className="text-brand-ink truncate text-[18px] font-bold tracking-[-0.03em]">
              {meetingNote.title}
            </h3>
            <p className="text-brand-muted mt-[6px] text-[12px] font-medium">
              {meetingNote.meetingDate}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {meetingNote.participants.map((participant) => (
              <div
                key={participant.id}
                className="flex size-7 items-center justify-center rounded-full text-[12px] font-semibold text-white"
                style={{ backgroundColor: participant.color }}
                title={participant.name}
                aria-label={participant.name}
              >
                {participant.initial}
              </div>
            ))}
          </div>
        </div>

        {isExpanded ? (
          <div className="mt-3 border-t border-[rgba(91,78,232,0.06)] pt-[17px]">
            <div>
              <p className="text-brand-muted text-[12px] font-bold tracking-[0.3px] uppercase">
                결정사항
              </p>
              <ul className="mt-2 space-y-1.5">
                {meetingNote.decisions.map((decision) => (
                  <li
                    key={decision}
                    className="text-brand-ink flex items-start gap-2 text-[14px] leading-5"
                  >
                    <Check className="mt-[3px] size-[14px] shrink-0 text-[#00c950]" />
                    <span>{decision}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <p className="text-brand-muted text-[12px] font-bold tracking-[0.3px] uppercase">
                후속 업무
              </p>
              <ul className="mt-2 space-y-1.5">
                {meetingNote.followUpActions.map((actionItem) => (
                  <li
                    key={actionItem}
                    className="text-brand-ink flex items-start gap-2 text-[14px] leading-5"
                  >
                    <ArrowRight className="text-brand-start mt-[3px] size-[14px] shrink-0" />
                    <span>{actionItem}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </article>
    </div>
  );
}
