// 목업 워크스페이스 멤버 데이터와 타입의 공개 API입니다.
export type {
  WorkspaceMember,
  WorkspaceMemberRole,
  WorkspaceMemberStatus,
} from './model/workspace-member.types';
export { mockCurrentWorkspaceMember } from './model/mock-current-workspace-member';
// 서버 전용 getWorkspaceMembersByWorkspaceId는 next/headers 의존이 있어 배럴로 재노출하지 않는다.
export {
  useWorkspaceMembersByWorkspaceId,
  workspaceMembersByWorkspaceQueryKey,
} from './api/use-workspace-members-by-id';
export {
  getMockWorkspaceMembersByWorkspaceId,
  mockWorkspaceMembers,
} from './model/mock-workspace-members';
// 서버 전용 조회 함수(next/headers 의존)는 클라이언트 번들 오염을 피하려 barrel에서 제외하고
// RSC에서 직접 경로로 import한다. (getWorkspaceById와 동일한 컨벤션)
export { updateMyNickname, type UpdateMyNicknameInput } from './api/update-my-nickname';
export {
  WORKSPACE_MEMBER_ROLE_META,
  WORKSPACE_MEMBER_STATUS_META,
  type BadgeTone,
} from './config/labels';
