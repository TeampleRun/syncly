// 채팅 초기 메시지와 참여자 데이터를 조회하는 동안 대화 패널을 표시합니다.
import { WorkspacePageSkeleton } from '@/widgets/workspace-page-skeleton';
export default function Loading() {
  return <WorkspacePageSkeleton variant="chat" />;
}
