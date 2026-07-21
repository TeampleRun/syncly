// 공지 목록을 조회하는 동안 공지 카드와 상세 영역의 자리를 유지합니다.
import { WorkspacePageSkeleton } from '@/widgets/workspace-page-skeleton';
export default function Loading() {
  return <WorkspacePageSkeleton variant="list" />;
}
