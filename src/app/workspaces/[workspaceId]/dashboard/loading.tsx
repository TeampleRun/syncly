// 대시보드 레이아웃과 위젯을 조회하는 동안 카드 배치를 유지합니다.
import { WorkspacePageSkeleton } from '@/widgets/workspace-page-skeleton';
export default function Loading() {
  return <WorkspacePageSkeleton variant="dashboard" />;
}
