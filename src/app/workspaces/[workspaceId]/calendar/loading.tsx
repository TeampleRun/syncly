// 캘린더 데이터를 조회하는 동안 월간 그리드의 자리를 유지합니다.
import { WorkspacePageSkeleton } from '@/widgets/workspace-page-skeleton';
export default function Loading() {
  return <WorkspacePageSkeleton variant="calendar" />;
}
