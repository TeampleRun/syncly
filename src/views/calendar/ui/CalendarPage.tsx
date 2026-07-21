import { CalendarView } from '@/features/manage-calendar';

interface CalendarPageProps {
  workspaceId: string;
  initialSelectedDate: string;
}

export default function CalendarPage({ workspaceId, initialSelectedDate }: CalendarPageProps) {
  return <CalendarView workspaceId={workspaceId} initialSelectedDate={initialSelectedDate} />;
}
