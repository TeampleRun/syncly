// 스프린트와 업무를 조회하는 동안 스프린트 보드의 자리를 유지합니다.
import { WorkspacePageSkeleton } from '@/widgets/workspace-page-skeleton';
export default function Loading() {
  return <WorkspacePageSkeleton variant="sprint" />;
}
