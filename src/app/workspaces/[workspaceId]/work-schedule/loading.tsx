// 주간 근무유형과 스케줄을 조회하는 동안 근무표의 행과 셀 자리를 유지합니다.
import { WorkspacePageSkeleton } from '@/widgets/workspace-page-skeleton';
export default function Loading() {
  return <WorkspacePageSkeleton variant="schedule" />;
}
