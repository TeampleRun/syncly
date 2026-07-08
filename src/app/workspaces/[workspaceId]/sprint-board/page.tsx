// 스프린트 보드 라우트 진입점 — 사이드 프로젝트 워크스페이스 전용.
// 목 단계에서는 데이터가 단일 currentSprint 기준이라 workspaceId를 사용하지 않는다.
// (실 API 전환 시 workspaceId로 스프린트/업무를 조회하도록 확장)
import { SprintBoardPage } from '@/views/side-project/sprint-board';

export default function SprintBoardRoute() {
  return <SprintBoardPage />;
}
