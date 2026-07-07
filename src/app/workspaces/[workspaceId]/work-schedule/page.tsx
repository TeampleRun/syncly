// 워크스페이스 근무 일정 페이지의 라우트 진입점입니다.
import { WorkScheduleView } from '@/views/store-operation/work-schedule';

interface WorkSchedulePageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

export default async function WorkSchedulePage({ params }: WorkSchedulePageProps) {
  const { workspaceId } = await params;

  return <WorkScheduleView workspaceId={workspaceId} />;
}
