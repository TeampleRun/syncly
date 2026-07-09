export interface CalendarDayCell {
  isoDate: string;
  dayNumber: number;
  isCurrentMonth: boolean;
}

function formatIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function createCalendarMonthLabel(currentMonth: Date) {
  return `${currentMonth.getFullYear()}년 ${currentMonth.getMonth() + 1}월`;
}

export function createCalendarMonthGrid(currentMonth: Date): CalendarDayCell[] {
  const year = currentMonth.getFullYear();
  const monthIndex = currentMonth.getMonth();
  const firstDayOfMonth = new Date(year, monthIndex, 1);
  const startDayIndex = firstDayOfMonth.getDay();
  const gridStartDate = new Date(year, monthIndex, 1 - startDayIndex);

  return Array.from({ length: 35 }, (_, index) => {
    const date = new Date(gridStartDate);
    date.setDate(gridStartDate.getDate() + index);

    return {
      isoDate: formatIsoDate(date),
      dayNumber: date.getDate(),
      isCurrentMonth: date.getMonth() === monthIndex,
    };
  });
}

export function getInitialCalendarDate() {
  return new Date(2025, 6, 1);
}
