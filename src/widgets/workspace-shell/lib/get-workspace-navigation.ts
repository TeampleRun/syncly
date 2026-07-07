// 워크스페이스 목적에 맞는 shell navigation 항목을 반환합니다.
import type { WorkspacePurpose } from '@/entities/workspace';
import { workspaceNavigationByPurpose } from '@/widgets/workspace-shell/model/workspace-navigation';

export function getWorkspaceNavigation(purpose: WorkspacePurpose) {
  return workspaceNavigationByPurpose[purpose];
}
