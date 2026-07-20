// 워크스페이스 공지 페이지의 라우트 진입점입니다.
import { getNoticeBoard } from '@/entities/notice/api/get-notice-board';
import { assertWorkspaceRouteAccess } from '@/entities/workspace/lib/assert-workspace-route-access';
import { NoticesView } from '@/views/store-operation/notices';

interface NoticesPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

export default async function NoticesPage({ params }: NoticesPageProps) {
  const { workspaceId } = await params;
  await assertWorkspaceRouteAccess(workspaceId, 'notices');
  const initialData = await getNoticeBoard(workspaceId);

  return <NoticesView workspaceId={workspaceId} initialData={initialData} />;
}
