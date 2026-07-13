import { CalendarPage } from '@/views/calendar';

interface WorkspaceCalendarPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

export default async function WorkspaceCalendarPage({ params }: WorkspaceCalendarPageProps) {
  const { workspaceId } = await params;

  return <CalendarPage workspaceId={workspaceId} />;
}
