// 전체 알림 목록을 조회하는 동안 알림 카드 목록의 자리를 유지합니다.
import { WorkspacePageSkeleton } from '@/widgets/workspace-page-skeleton';
export default function Loading() {
  return <WorkspacePageSkeleton variant="list" />;
}
