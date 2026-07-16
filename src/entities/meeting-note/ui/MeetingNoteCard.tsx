import { ArrowRight, Check, MoreHorizontal } from 'lucide-react';
import type { KeyboardEvent, MouseEvent } from 'react';
import type { MeetingNote } from '../model/meeting-note.types';

interface MeetingNoteCardProps {
  meetingNote: MeetingNote;
  isExpanded?: boolean;
  onClick?: () => void;
  // 수정·삭제 메뉴 관련 (권한이 있을 때만 노출). 메뉴 열림 상태는 목록이 소유한다.
  canManage?: boolean;
  isMenuOpen?: boolean;
  onToggleMenu?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
}

export function MeetingNoteCard({
  meetingNote,
  isExpanded = false,
  onClick,
  canManage = false,
  isMenuOpen = false,
  onToggleMenu,
  onEdit,
  onDelete,
  isDeleting = false,
}: MeetingNoteCardProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) {
      return;
    }

    // 중첩된 메뉴/수정/삭제 버튼에서 버블링된 키 이벤트로는 카드가 토글되지 않도록,
    // 카드 자신이 포커스된 상태의 키 입력만 처리한다.
    if (event.target !== event.currentTarget) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };

  // 메뉴 관련 클릭은 카드 펼침(onClick)으로 전파되지 않도록 막는다.
  const stopCardToggle = (event: MouseEvent) => {
    event.stopPropagation();
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

            {canManage ? (
              <div className="relative ml-1">
                <button
                  type="button"
                  aria-label={`${meetingNote.title} 메뉴 열기`}
                  aria-expanded={isMenuOpen}
                  onClick={(event) => {
                    stopCardToggle(event);
                    onToggleMenu?.();
                  }}
                  className="text-brand-muted hover:bg-brand-soft hover:text-brand-ink flex size-8 items-center justify-center rounded-full transition"
                >
                  <MoreHorizontal className="size-5" aria-hidden="true" />
                </button>

                {isMenuOpen ? (
                  <div
                    onClick={stopCardToggle}
                    className="absolute top-9 right-0 z-10 w-28 overflow-hidden rounded-xl border border-[#ebeef7] bg-white py-2 text-[14px] font-bold text-brand-ink shadow-[0_18px_40px_rgba(91,78,232,0.14)]"
                  >
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={(event) => {
                        stopCardToggle(event);
                        onEdit?.();
                      }}
                      className="hover:bg-brand-soft hover:text-brand block w-full px-4 py-2 text-left disabled:opacity-50"
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={(event) => {
                        stopCardToggle(event);
                        onDelete?.();
                      }}
                      className="block w-full px-4 py-2 text-left text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                    >
                      삭제
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
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
