// 워크스페이스 자료실 페이지의 라우트 진입점입니다.
import { ResourcesView } from '@/views/store-operation/resources';

interface FilesPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

export default async function FilesPage({ params }: FilesPageProps) {
  const { workspaceId } = await params;

  return <ResourcesView workspaceId={workspaceId} />;
}
