// 워크스페이스 전체 알림 화면의 서버 라우트입니다.
import { getNotificationsPage } from '@/entities/notification';
import { getCurrentUserId } from '@/shared/api/supabase/current-user';
import { NotificationsView } from '@/views/notifications';

interface NotificationsPageProps {
  params: Promise<{ workspaceId: string }>;
}

export default async function NotificationsPage({ params }: NotificationsPageProps) {
  const { workspaceId } = await params;
  const [initialData, viewerId] = await Promise.all([
    getNotificationsPage({ workspaceId }),
    getCurrentUserId(),
  ]);

  return <NotificationsView workspaceId={workspaceId} viewerId={viewerId} initialData={initialData} />;
}
