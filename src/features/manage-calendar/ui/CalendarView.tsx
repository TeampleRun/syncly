'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Pencil, Plus, X } from 'lucide-react';
import {
  CalendarEventChip,
  type CalendarEvent,
  type CalendarEventColor,
  type CalendarEventFormValues,
  formatCalendarEventTimeLabel,
  useCalendarEventsByWorkspaceId,
  useCreateCalendarEvent,
  useDeleteCalendarEvent,
  useUpdateCalendarEvent,
} from '@/entities/calendar-event';
import { plusJakartaSans } from '@/shared/lib/fonts';
import {
  createCalendarMonthGrid,
  createCalendarMonthLabel,
  getInitialCalendarDate,
} from '../model/calendar-utils';

interface CalendarViewProps {
  workspaceId: string;
}

const weekdayLabels = ['일', '월', '화', '수', '목', '금', '토'] as const;
const colorOptions: CalendarEventColor[] = [
  'violet',
  'purple',
  'blue',
  'green',
  'amber',
  'coral',
  'pink',
];

const colorButtonClassNames: Record<CalendarEventColor, string> = {
  violet: 'bg-[#6b5cff]',
  purple: 'bg-[#8b5cf6]',
  blue: 'bg-[#3b82f6]',
  green: 'bg-[#10b74a]',
  amber: 'bg-[#ff9f0a]',
  coral: 'bg-[#ff6565]',
  pink: 'bg-[#eb2f96]',
};

const colorDotClassNames: Record<CalendarEventColor, string> = {
  violet: 'bg-[#6b5cff]',
  purple: 'bg-[#8b5cf6]',
  blue: 'bg-[#3b82f6]',
  green: 'bg-[#10b74a]',
  amber: 'bg-[#ff9f0a]',
  coral: 'bg-[#ff6565]',
  pink: 'bg-[#eb2f96]',
};

const defaultFormValues: CalendarEventFormValues = {
  title: '',
  time: '',
  color: 'violet',
};

function formatSelectedDateLabel(isoDate: string) {
  const [year, month, day] = isoDate.split('-');
  return `${year}년 ${Number(month)}월 ${Number(day)}일`;
}

export function CalendarView({ workspaceId }: CalendarViewProps) {
  const calendarEventsQuery = useCalendarEventsByWorkspaceId(workspaceId);
  const createCalendarEventMutation = useCreateCalendarEvent(workspaceId);
  const deleteCalendarEventMutation = useDeleteCalendarEvent(workspaceId);
  const updateCalendarEventMutation = useUpdateCalendarEvent(workspaceId);
  const calendarEvents = calendarEventsQuery.data ?? [];
  const [currentMonth, setCurrentMonth] = useState(getInitialCalendarDate);
  const [selectedDate, setSelectedDate] = useState('2025-07-30');
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [formValues, setFormValues] = useState(defaultFormValues);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  const monthGrid = createCalendarMonthGrid(currentMonth);
  const monthLabel = createCalendarMonthLabel(currentMonth);
  const isTitleValid = formValues.title.trim().length > 0;
  const [year, month, day] = selectedDate.split('-');
  const isEditMode = editingEventId !== null;
  const modalDateLabel = `${year}년 ${Number(month)}월 ${Number(day)}일 일정 ${isEditMode ? '수정' : '추가'}`;
  const selectedDateLabel = formatSelectedDateLabel(selectedDate);
  const isSubmitting =
    createCalendarEventMutation.isPending ||
    updateCalendarEventMutation.isPending ||
    deleteCalendarEventMutation.isPending;

  const eventsByDate = calendarEvents.reduce<Record<string, CalendarEvent[]>>(
    (accumulator, event) => {
      accumulator[event.date] = [...(accumulator[event.date] ?? []), event];
      return accumulator;
    },
    {},
  );
  const selectedDateEvents = eventsByDate[selectedDate] ?? [];

  const openAddEventModal = (isoDate: string) => {
    setSelectedDate(isoDate);
    setEditingEventId(null);
    setFormValues(defaultFormValues);
    setHasSubmitted(false);
    setIsAddEventOpen(true);
  };

  const openEditEventModal = (calendarEvent: CalendarEvent) => {
    setSelectedDate(calendarEvent.date);
    setEditingEventId(calendarEvent.id);
    setFormValues({
      title: calendarEvent.title,
      time: calendarEvent.time ?? '',
      color: calendarEvent.color,
    });
    setHasSubmitted(false);
    setIsAddEventOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);

    if (!isTitleValid || isSubmitting) {
      return;
    }

    try {
      if (isEditMode && editingEventId) {
        await updateCalendarEventMutation.mutateAsync({
          eventId: editingEventId,
          title: formValues.title.trim(),
          date: selectedDate,
          time: formValues.time.trim() || null,
          color: formValues.color,
        });
      } else {
        await createCalendarEventMutation.mutateAsync({
          title: formValues.title.trim(),
          date: selectedDate,
          time: formValues.time.trim() || null,
          color: formValues.color,
        });
      }
      setIsAddEventOpen(false);
    } catch {
      return;
    }
  };

  return (
    <div className={`${plusJakartaSans.className} bg-brand-surface min-h-full`}>
      <section className="w-full max-w-[1180px]">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
          <div className="w-full flex-1">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div className="text-brand-ink flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentMonth(
                      (current) => new Date(current.getFullYear(), current.getMonth() - 1, 1),
                    )
                  }
                  className="text-brand-muted hover:text-brand-ink transition"
                  aria-label="이전 달"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <h1 className="text-[18px] font-bold tracking-[-0.04em] sm:text-[20px]">
                  {monthLabel}
                </h1>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentMonth(
                      (current) => new Date(current.getFullYear(), current.getMonth() + 1, 1),
                    )
                  }
                  className="text-brand-muted hover:text-brand-ink transition"
                  aria-label="다음 달"
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => openAddEventModal(selectedDate)}
                className="bg-brand inline-flex h-9 items-center gap-2 rounded-full px-4 text-[13px] font-bold text-white shadow-[0_10px_22px_rgba(91,78,232,0.2)] transition hover:brightness-105"
              >
                <Plus className="size-4" />
                일정 추가
              </button>
            </div>

            <div className="overflow-hidden rounded-[20px] border border-[rgba(91,78,232,0.1)] bg-white shadow-[0_10px_30px_rgba(91,78,232,0.06)]">
              <div className="grid grid-cols-7 border-b border-[rgba(91,78,232,0.1)]">
                {weekdayLabels.map((label, index) => (
                  <div
                    key={label}
                    className={`px-4 py-[9px] text-center text-[11px] font-semibold ${
                      index === 0
                        ? 'text-[#fb2c36]'
                        : index === 6
                          ? 'text-[#2b7fff]'
                          : 'text-brand-muted'
                    }`}
                  >
                    {label}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7">
                {monthGrid.map((cell, index) => {
                  const dayEvents = eventsByDate[cell.isoDate] ?? [];
                  const isSelected = cell.isoDate === selectedDate;

                  return (
                    <button
                      key={cell.isoDate}
                      type="button"
                      onClick={() => setSelectedDate(cell.isoDate)}
                      className={`hover:bg-brand-soft/30 relative min-h-[98px] border-r border-b border-[rgba(91,78,232,0.1)] px-[8px] pt-[5px] pb-[8px] text-left align-top transition sm:min-h-[108px] ${
                        (index + 1) % 7 === 0 ? 'border-r-0' : ''
                      } ${isSelected ? 'bg-[rgba(238,240,251,0.6)]' : ''}`}
                    >
                      <div className="absolute top-[5px] left-[8px]">
                        <span
                          className={`flex size-6 items-center justify-center rounded-full text-[12px] leading-4 font-bold ${
                            isSelected
                              ? 'bg-brand text-white'
                              : !cell.isCurrentMonth
                                ? 'text-[#c1c5da]'
                                : index % 7 === 0
                                  ? 'text-[#fb2c36]'
                                  : index % 7 === 6
                                    ? 'text-[#2b7fff]'
                                    : 'text-brand-ink'
                          }`}
                        >
                          {cell.dayNumber}
                        </span>
                      </div>
                      <div className="space-y-1 pt-7">
                        {dayEvents.slice(0, 2).map((calendarEvent) => (
                          <CalendarEventChip key={calendarEvent.id} event={calendarEvent} />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="w-full xl:max-w-[320px]">
            <div className="rounded-[20px] border border-[rgba(91,78,232,0.1)] bg-white p-5 shadow-[0_10px_30px_rgba(91,78,232,0.06)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-brand-ink text-[18px] font-bold tracking-[-0.03em]">
                    {selectedDateLabel}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => openAddEventModal(selectedDate)}
                  className="bg-brand-soft text-brand hover:bg-brand inline-flex size-9 items-center justify-center rounded-full transition hover:text-white"
                  aria-label="선택한 날짜 일정 추가"
                >
                  <Plus className="size-4" />
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {calendarEventsQuery.isPending ? (
                  <div className="rounded-[18px] border border-dashed border-[rgba(91,78,232,0.16)] bg-[#fbfbff] px-4 py-6 text-center">
                    <p className="text-brand-ink text-[14px] font-semibold">일정을 불러오는 중이에요</p>
                  </div>
                ) : calendarEventsQuery.isError ? (
                  <div className="rounded-[18px] border border-dashed border-[rgba(255,101,101,0.24)] bg-[#fff8f8] px-4 py-6 text-center">
                    <p className="text-brand-ink text-[14px] font-semibold">일정을 불러오지 못했어요</p>
                    <button
                      type="button"
                      onClick={() => void calendarEventsQuery.refetch()}
                      className="text-brand mt-3 text-[13px] font-semibold"
                    >
                      다시 시도
                    </button>
                  </div>
                ) : selectedDateEvents.length > 0 ? (
                  selectedDateEvents.map((calendarEvent) => (
                    <article
                      key={calendarEvent.id}
                      className="rounded-[18px] border border-[rgba(91,78,232,0.08)] bg-[#f8f9ff] px-4 py-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <span
                            className={`mt-1 size-2.5 shrink-0 rounded-full ${colorDotClassNames[calendarEvent.color]}`}
                            aria-hidden="true"
                          />
                          <div className="min-w-0">
                            <p className="text-brand-ink truncate text-[14px] font-semibold">
                              {calendarEvent.title}
                            </p>
                            <p className="text-brand-muted mt-1 text-[12px] font-medium">
                              {formatCalendarEventTimeLabel(calendarEvent.time)}
                            </p>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEditEventModal(calendarEvent)}
                            disabled={isSubmitting}
                            className="text-brand-muted hover:bg-brand-soft hover:text-brand-ink inline-flex size-6 items-center justify-center rounded-full transition disabled:opacity-50"
                            aria-label={`${calendarEvent.title} 일정 수정`}
                          >
                            <Pencil className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteCalendarEventMutation.mutate(calendarEvent.id)}
                            disabled={isSubmitting}
                            className="text-brand-muted hover:bg-brand-soft hover:text-brand-ink inline-flex size-6 items-center justify-center rounded-full transition disabled:opacity-50"
                            aria-label={`${calendarEvent.title} 일정 삭제`}
                          >
                            <X className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-[18px] border border-dashed border-[rgba(91,78,232,0.16)] bg-[#fbfbff] px-4 py-6 text-center">
                    <p className="text-brand-ink text-[14px] font-semibold">등록된 일정이 없어요</p>
                    <p className="text-brand-muted mt-1 text-[12px] leading-5">
                      오른쪽 상단 버튼이나 일정 추가 버튼으로
                      <br />새 일정을 등록해보세요.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {isAddEventOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#1a1b2e]/18 px-4">
          <div className="w-full max-w-[280px] rounded-[20px] bg-white p-4 shadow-[0_18px_40px_rgba(26,27,46,0.18)] sm:max-w-[420px] sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-brand-ink text-[17px] font-bold tracking-[-0.03em] sm:text-[18px]">
                {modalDateLabel}
              </h2>
              <button
                type="button"
                onClick={() => setIsAddEventOpen(false)}
                className="text-brand-muted hover:bg-brand-soft hover:text-brand-ink rounded-full p-1 transition"
                aria-label="모달 닫기"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4">
              <div>
                <label className="text-brand-muted block text-[12px] font-semibold">
                  일정 이름 <span className="text-[#ff6565]">*</span>
                </label>
                <input
                  type="text"
                  value={formValues.title}
                  disabled={isSubmitting}
                  onChange={(event) =>
                    setFormValues((current) => ({ ...current, title: event.target.value }))
                  }
                  placeholder="예: 팀 회의"
                  className={`text-brand-ink mt-2 h-11 w-full rounded-[16px] bg-[#f1f3fb] px-4 text-[14px] transition outline-none placeholder:text-[#a8afc8] ${
                    hasSubmitted && !isTitleValid
                      ? 'ring-1 ring-[#ff6b6b]'
                      : 'focus:ring-brand focus:ring-1'
                  }`}
                />
                {hasSubmitted && !isTitleValid ? (
                  <p className="mt-2 text-[12px] font-medium text-[#ff6b6b]">
                    일정 이름을 입력해주세요.
                  </p>
                ) : null}
              </div>

              <div className="mt-4">
                <label className="text-brand-muted block text-[12px] font-semibold">
                  시간 (선택)
                </label>
                <input
                  type="time"
                  step={60}
                  value={formValues.time}
                  disabled={isSubmitting}
                  onChange={(event) =>
                    setFormValues((current) => ({ ...current, time: event.target.value }))
                  }
                  className="text-brand-ink focus:ring-brand mt-2 h-11 w-full rounded-[16px] bg-[#f1f3fb] px-4 text-[14px] transition outline-none placeholder:text-[#a8afc8] focus:ring-1"
                />
              </div>

              <div className="mt-4">
                <p className="text-brand-muted text-[12px] font-semibold">색상</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setFormValues((current) => ({ ...current, color }))}
                      className={`size-6 rounded-full ${colorButtonClassNames[color]} ${
                        formValues.color === color ? 'ring-2 ring-[#d7dcf6] ring-offset-2' : ''
                      }`}
                      aria-label={`${color} 색상 선택`}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddEventOpen(false)}
                  disabled={isSubmitting}
                  className="text-brand-ink h-10 rounded-full bg-[#f1f3fb] text-[15px] font-semibold disabled:opacity-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-brand h-10 rounded-full text-[15px] font-semibold text-white shadow-[0_10px_24px_rgba(91,78,232,0.2)] disabled:opacity-50"
                >
                  {isEditMode ? '수정' : '추가'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
