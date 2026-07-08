// 워크스페이스 공지 페이지의 라우트 진입점입니다.
import { NoticesView } from '@/views/store-operation/notices';

interface NoticesPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

export default async function NoticesPage({ params }: NoticesPageProps) {
  const { workspaceId } = await params;

  return <NoticesView workspaceId={workspaceId} />;
}
