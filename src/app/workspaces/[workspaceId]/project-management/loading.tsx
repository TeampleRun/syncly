// 프로젝트 업무 보드를 조회하는 동안 칸반 열과 업무 카드의 자리를 유지합니다.
import { WorkspacePageSkeleton } from '@/widgets/workspace-page-skeleton';
export default function Loading() {
  return <WorkspacePageSkeleton variant="kanban" />;
}
