import { CalendarView } from '@/features/manage-calendar';

interface CalendarPageProps {
  workspaceId: string;
}

export default function CalendarPage({ workspaceId }: CalendarPageProps) {
  return <CalendarView workspaceId={workspaceId} />;
}
