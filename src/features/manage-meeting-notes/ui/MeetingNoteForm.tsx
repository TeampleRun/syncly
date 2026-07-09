'use client';

import { useEffect, useRef, useState } from 'react';
import { CalendarDays, Check, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { MeetingNoteFormValues, MeetingNoteParticipant } from '@/entities/meeting-note';
import { getMockWorkspaceMembersByWorkspaceId } from '@/entities/workspace-member';
import { useMeetingNotesStore } from '../model/use-meeting-notes-store';

interface MeetingNoteFormProps {
  workspaceId: string;
}

function getTodayIsoDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

const fieldClassName =
  'w-full rounded-[18px] border border-[#e6eaf5] bg-[#f4f6ff] px-5 py-4 text-[16px] text-brand-ink placeholder:text-[#a0a6bf] focus:border-[var(--color-brand)] focus:bg-white focus:outline-none';
const dateFieldClassName =
  'flex min-h-[46.74px] items-center rounded-[19.121px] bg-[#f1f3f9] px-[19px] py-[10px]';

type DateFieldKey = 'year' | 'month' | 'day';

function getDatePartsFromIso(dateValue: string) {
  if (!dateValue) {
    return { year: '', month: '', day: '' };
  }

  const [year, month, day] = dateValue.split('-');
  if (!year || !month || !day) {
    return { year: '', month: '', day: '' };
  }

  return { year, month, day };
}

function getIsoDateFromParts(yearText: string, monthText: string, dayText: string) {
  if (yearText.length !== 4 || monthText.length !== 2 || dayText.length !== 2) {
    return null;
  }

  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  if (
    Number.isNaN(year) ||
    Number.isNaN(month) ||
    Number.isNaN(day) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }

  const nextDate = new Date(year, month - 1, day);
  if (
    nextDate.getFullYear() !== year ||
    nextDate.getMonth() !== month - 1 ||
    nextDate.getDate() !== day
  ) {
    return null;
  }

  return `${yearText}-${monthText.padStart(2, '0')}-${dayText.padStart(2, '0')}`;
}

function createMeetingNoteId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `meeting-note-${crypto.randomUUID()}`;
  }

  return `meeting-note-${Math.random().toString(36).slice(2, 10)}`;
}

export function MeetingNoteForm({ workspaceId }: MeetingNoteFormProps) {
  const router = useRouter();
  const workspaceMembers = getMockWorkspaceMembersByWorkspaceId(workspaceId);
  const addMeetingNote = useMeetingNotesStore((state) => state.addMeetingNote);
  const [formValues, setFormValues] = useState<MeetingNoteFormValues>(() => {
    const initialMeetingDate = getTodayIsoDate();

    return {
      title: '',
      meetingDate: initialMeetingDate,
      decisions: '',
      followUpActions: '',
    };
  });
  const [dateParts, setDateParts] = useState(() => getDatePartsFromIso(getTodayIsoDate()));
  const [selectedParticipantIds, setSelectedParticipantIds] = useState<string[]>([]);
  const [isParticipantListOpen, setIsParticipantListOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const yearInputRef = useRef<HTMLInputElement>(null);
  const monthInputRef = useRef<HTMLInputElement>(null);
  const dayInputRef = useRef<HTMLInputElement>(null);
  const participantFieldRef = useRef<HTMLDivElement>(null);

  const handleChange = (field: keyof MeetingNoteFormValues, value: string) => {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setHasSubmitted(true);
    if (!formValues.title.trim()) {
      return;
    }

    const participantPalette = ['#FE9A00', '#00C950', '#615FFF', '#2B7FFF', '#00B8DB', '#FF6B6B'];
    // 체크한 멤버를 목록 카드에서 바로 렌더링할 수 있는 아바타 데이터로 변환합니다.
    const participants: MeetingNoteParticipant[] = selectedParticipants.map((member, index) => ({
      id: member.userId,
      name: member.workspaceNickname,
      initial: member.avatarLabel,
      color: participantPalette[index % participantPalette.length],
    }));

    addMeetingNote(workspaceId, {
      id: createMeetingNoteId(),
      workspaceId,
      title: formValues.title.trim(),
      meetingDate: formValues.meetingDate,
      participants,
      decisions: formValues.decisions
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
      followUpActions: formValues.followUpActions
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
    });

    router.push(`/workspaces/${workspaceId}/meeting-notes`);
  };

  useEffect(() => {
    if (!isParticipantListOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      // 드롭다운 바깥을 클릭하면 패널만 닫고, 체크 상태는 그대로 유지합니다.
      if (!participantFieldRef.current?.contains(event.target as Node)) {
        setIsParticipantListOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [isParticipantListOpen]);

  const selectedParticipants = workspaceMembers.filter((member) =>
    selectedParticipantIds.includes(member.userId),
  );
  const isTitleValid = formValues.title.trim().length > 0;

  const handleOpenDatePicker = () => {
    const input = dateInputRef.current;
    if (!input) {
      return;
    }

    if (typeof input.showPicker === 'function') {
      input.showPicker();
      return;
    }

    input.focus();
    input.click();
  };

  const moveToNextDateField = (field: DateFieldKey) => {
    if (field === 'year') {
      monthInputRef.current?.focus();
      monthInputRef.current?.select();
      return;
    }

    if (field === 'month') {
      dayInputRef.current?.focus();
      dayInputRef.current?.select();
    }
  };

  const moveToPreviousDateField = (field: DateFieldKey) => {
    if (field === 'month') {
      yearInputRef.current?.focus();
      yearInputRef.current?.select();
      return;
    }

    if (field === 'day') {
      monthInputRef.current?.focus();
      monthInputRef.current?.select();
    }
  };

  const syncMeetingDate = (nextParts: typeof dateParts) => {
    const nextIsoDate = getIsoDateFromParts(nextParts.year, nextParts.month, nextParts.day);
    if (nextIsoDate) {
      handleChange('meetingDate', nextIsoDate);
    }
  };

  const handleDatePartChange = (field: DateFieldKey, value: string) => {
    const numericValue = value.replace(/\D/g, '');
    const maxLength = field === 'year' ? 4 : 2;
    const trimmedValue = numericValue.slice(0, maxLength);

    const nextParts = {
      ...dateParts,
      [field]: trimmedValue,
    };

    setDateParts(nextParts);
    syncMeetingDate(nextParts);

    // 월/일 두 자리가 채워지면 다음 칸으로 넘겨서 빠르게 입력할 수 있게 합니다.
    if (trimmedValue.length === maxLength) {
      moveToNextDateField(field);
    }
  };

  const handleDatePartKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    field: DateFieldKey,
  ) => {
    if (event.key === 'Backspace' && dateParts[field].length === 0) {
      moveToPreviousDateField(field);
    }
  };

  const handleDatePartBlur = () => {
    const nextIsoDate = getIsoDateFromParts(dateParts.year, dateParts.month, dateParts.day);

    if (!nextIsoDate) {
      setDateParts(getDatePartsFromIso(formValues.meetingDate));
      return;
    }

    setDateParts(getDatePartsFromIso(nextIsoDate));
    handleChange('meetingDate', nextIsoDate);
  };

  const toggleParticipant = (userId: string) => {
    setSelectedParticipantIds((current) => {
      return current.includes(userId)
        ? current.filter((id) => id !== userId)
        : [...current, userId];
    });
  };

  return (
    <section className="max-w-[714px]">
      <Link
        href={`/workspaces/${workspaceId}/meeting-notes`}
        className="text-brand-muted hover:text-brand-ink inline-flex items-center gap-2 text-[16px] font-semibold transition"
      >
        <span aria-hidden="true">←</span>
        목록으로
      </Link>

      <form
        onSubmit={handleSubmit}
        className="mt-[21px] rounded-[32px] border border-[#eceffa] bg-white px-[26.5px] pt-[26.5px] pb-[28px] shadow-[0_20px_48px_rgba(91,78,232,0.08)]"
      >
        <h1 className="text-brand-ink text-[34px] font-extrabold tracking-[-0.04em]">새 회의록</h1>

        <div className="mt-8 space-y-[22px]">
          <label className="block">
            <span className="text-brand-ink mb-2.5 block text-[17px] font-semibold">회의 제목</span>
            <input
              type="text"
              value={formValues.title}
              onChange={(event) => handleChange('title', event.target.value)}
              placeholder="회의 제목을 입력하세요."
              className={`${fieldClassName} ${hasSubmitted && !isTitleValid ? 'border-[#ff6b6b] bg-[#fff6f6] focus:border-[#ff6b6b]' : ''}`}
            />
            {hasSubmitted && !isTitleValid ? (
              <p className="mt-2 text-[14px] font-medium text-[#ff6b6b]">
                회의 제목을 입력해주세요.
              </p>
            ) : null}
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="text-brand-ink mb-2.5 block text-[17px] font-semibold">날짜</span>
              <div className="relative">
                <input
                  ref={dateInputRef}
                  type="date"
                  value={formValues.meetingDate}
                  onChange={(event) => {
                    handleChange('meetingDate', event.target.value);
                    setDateParts(getDatePartsFromIso(event.target.value));
                  }}
                  className="pointer-events-none absolute opacity-0"
                  aria-label="회의 날짜 선택"
                  aria-hidden="true"
                  tabIndex={-1}
                />
                <div
                  className={`${dateFieldClassName} text-brand-ink gap-2 pr-[14px] text-[18px] font-medium tracking-[-0.03em]`}
                >
                  <input
                    ref={yearInputRef}
                    type="text"
                    inputMode="numeric"
                    value={dateParts.year}
                    onChange={(event) => handleDatePartChange('year', event.target.value)}
                    onKeyDown={(event) => handleDatePartKeyDown(event, 'year')}
                    onBlur={handleDatePartBlur}
                    placeholder="2025"
                    className="text-brand-ink w-[4ch] bg-transparent text-center outline-none placeholder:text-[#a0a6bf]"
                  />
                  <span className="text-brand-muted">.</span>
                  <input
                    ref={monthInputRef}
                    type="text"
                    inputMode="numeric"
                    value={dateParts.month}
                    onChange={(event) => handleDatePartChange('month', event.target.value)}
                    onKeyDown={(event) => handleDatePartKeyDown(event, 'month')}
                    onBlur={handleDatePartBlur}
                    placeholder="06"
                    className="text-brand-ink w-[2ch] bg-transparent text-center outline-none placeholder:text-[#a0a6bf]"
                  />
                  <span className="text-brand-muted">.</span>
                  <input
                    ref={dayInputRef}
                    type="text"
                    inputMode="numeric"
                    value={dateParts.day}
                    onChange={(event) => handleDatePartChange('day', event.target.value)}
                    onKeyDown={(event) => handleDatePartKeyDown(event, 'day')}
                    onBlur={handleDatePartBlur}
                    placeholder="30"
                    className="text-brand-ink w-[2ch] bg-transparent text-center outline-none placeholder:text-[#a0a6bf]"
                  />
                  <span className="text-brand-muted">.</span>
                  <div className="ml-auto">
                    <button
                      type="button"
                      onClick={handleOpenDatePicker}
                      className="hover:text-brand-muted flex size-6 items-center justify-center rounded-md bg-white/70 text-[#d5d9e8] transition"
                      aria-label="달력 열기"
                    >
                      <CalendarDays className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </label>

            <label className="block">
              <span className="text-brand-ink mb-2.5 block text-[17px] font-semibold">참석자</span>
              <div ref={participantFieldRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsParticipantListOpen((current) => !current)}
                  className={`${fieldClassName} flex min-h-[58px] items-center justify-between gap-3 text-left`}
                >
                  <div className="flex min-w-0 flex-1 flex-wrap gap-2">
                    {selectedParticipants.length > 0 ? (
                      selectedParticipants.map((member) => (
                        <span
                          key={member.userId}
                          className="text-brand-ink inline-flex items-center rounded-full bg-white px-3 py-1 text-[14px] font-medium shadow-[0_1px_4px_rgba(91,78,232,0.08)]"
                        >
                          {member.workspaceNickname}
                        </span>
                      ))
                    ) : (
                      <span className="text-[#a0a6bf]">참석자를 선택하세요.</span>
                    )}
                  </div>
                  <ChevronDown
                    className={`size-5 shrink-0 text-[#a0a6bf] transition ${isParticipantListOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>

                {isParticipantListOpen ? (
                  <div className="absolute top-[calc(100%+8px)] left-0 z-20 w-full rounded-[20px] border border-[#e6eaf5] bg-white p-2 shadow-[0_18px_40px_rgba(91,78,232,0.14)]">
                    <div className="max-h-56 space-y-1 overflow-y-auto">
                      {workspaceMembers.map((member) => {
                        const isSelected = selectedParticipantIds.includes(member.userId);

                        return (
                          <button
                            key={member.userId}
                            type="button"
                            onClick={() => toggleParticipant(member.userId)}
                            className="hover:bg-brand-soft flex w-full items-center justify-between rounded-[14px] px-3 py-3 text-left transition"
                          >
                            <div className="flex items-center gap-3">
                              <div className="bg-brand flex size-9 items-center justify-center rounded-full text-[15px] font-semibold text-white">
                                {member.avatarLabel}
                              </div>
                              <div>
                                <p className="text-brand-ink text-[15px] font-semibold">
                                  {member.workspaceNickname}
                                </p>
                                <p className="text-brand-muted text-[13px]">
                                  {member.role === 'owner' ? '팀장' : '팀원'}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`flex size-5 items-center justify-center rounded-md border ${isSelected ? 'border-brand bg-brand text-white' : 'border-[#d9deee] bg-white text-transparent'}`}
                            >
                              <Check className="size-3.5" />
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            </label>
          </div>

          <label className="block">
            <span className="text-brand-ink mb-2.5 block text-[17px] font-semibold">결정사항</span>
            <textarea
              value={formValues.decisions}
              onChange={(event) => handleChange('decisions', event.target.value)}
              placeholder="결정사항을 입력하세요."
              rows={6}
              className={`${fieldClassName} resize-none`}
            />
          </label>

          <label className="block">
            <span className="text-brand-ink mb-2.5 block text-[17px] font-semibold">후속 업무</span>
            <textarea
              value={formValues.followUpActions}
              onChange={(event) => handleChange('followUpActions', event.target.value)}
              placeholder="후속 업무를 입력하세요."
              rows={6}
              className={`${fieldClassName} resize-none`}
            />
          </label>
        </div>

        <button
          type="submit"
          className={`mt-8 inline-flex h-13 w-full items-center justify-center rounded-[18px] text-[17px] font-bold text-white shadow-[0_14px_30px_rgba(91,78,232,0.24)] transition ${
            isTitleValid
              ? 'bg-brand hover:brightness-105'
              : 'bg-[#cfd3e6] shadow-none hover:brightness-100'
          }`}
        >
          저장하기
        </button>
      </form>
    </section>
  );
}
