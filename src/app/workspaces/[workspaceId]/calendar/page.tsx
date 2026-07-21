import { CalendarPage } from '@/views/calendar';

interface WorkspaceCalendarPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

function getSeoulTodayIsoDate() {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = formatter.formatToParts(new Date());
  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  return `${year}-${month}-${day}`;
}

export default async function WorkspaceCalendarPage({ params }: WorkspaceCalendarPageProps) {
  const { workspaceId } = await params;
  const initialSelectedDate = getSeoulTodayIsoDate();

  return <CalendarPage workspaceId={workspaceId} initialSelectedDate={initialSelectedDate} />;
}
