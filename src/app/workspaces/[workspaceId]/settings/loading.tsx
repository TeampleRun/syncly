// 워크스페이스 설정과 멤버 정보를 조회하는 동안 설정 폼의 자리를 유지합니다.
import { WorkspacePageSkeleton } from '@/widgets/workspace-page-skeleton';
export default function Loading() {
  return <WorkspacePageSkeleton variant="settings" />;
}
