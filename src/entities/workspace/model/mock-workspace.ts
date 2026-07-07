// 워크스페이스 API 연결 전 사이드바에 표시하는 현재 워크스페이스 목업입니다.
import type { Workspace } from './workspace.types';

const mockWorkspacesById: Record<string, Workspace> = {
  test: {
    id: 'test',
    name: '캡스톤 디자인 팀',
    purpose: 'team-project',
  },
  'store-test': {
    id: 'store-test',
    name: '카페 그레이 운영',
    purpose: 'store-operation',
  },
};

export const mockWorkspace: Workspace = mockWorkspacesById['store-test'];

export function getMockWorkspaceById(workspaceId: string): Workspace {
  return mockWorkspacesById[workspaceId] ?? mockWorkspace;
}
