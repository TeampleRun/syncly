import { cn } from '@/shared/lib/utils';
import type { CalendarEvent, CalendarEventColor } from '../model/calendar-event.types';

const colorClassNames: Record<CalendarEventColor, string> = {
  violet: 'bg-[#6b5cff]',
  purple: 'bg-[#7f5cff]',
  blue: 'bg-[#2f7df6]',
  green: 'bg-[#10b74a]',
  amber: 'bg-[#ff9f0a]',
  coral: 'bg-[#ff6565]',
  pink: 'bg-[#eb2f96]',
};

interface CalendarEventChipProps {
  event: CalendarEvent;
}

export function CalendarEventChip({ event }: CalendarEventChipProps) {
  return (
    <div
      className={cn(
        'h-5 truncate rounded-full px-2 text-[10px] leading-5 font-semibold text-white',
        colorClassNames[event.color],
      )}
      title={event.title}
    >
      {event.title}
    </div>
  );
}
