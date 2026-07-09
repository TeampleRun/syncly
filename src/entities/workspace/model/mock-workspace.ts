// 워크스페이스 API 연결 전 사이드바와 purpose별 navigation 확인에 사용하는 목업입니다.
import { cache } from 'react';
import type { Workspace } from './workspace.types';

const mockWorkspacesById: Record<string, Workspace> = {
  'store-workspace': {
    id: 'store-workspace',
    name: '카페 그레이 운영',
    purpose: 'store-operation',
    description: '카페 그레이 매장 운영을 위한 워크스페이스입니다.',
  },
  'team-workspace': {
    id: 'team-workspace',
    name: '캡스톤 디자인 팀',
    purpose: 'team-project',
    description: '캡스톤 디자인 프로젝트 협업 공간입니다.',
  },
  'side-workspace': {
    id: 'side-workspace',
    name: 'Fitto 앱 개발팀',
    purpose: 'side-project',
    description: 'Fitto 앱 사이드 프로젝트 개발팀 워크스페이스입니다.',
  },
};

export const mockWorkspace: Workspace = mockWorkspacesById['store-workspace'];

export const getMockWorkspaceById = cache(
  (workspaceId: string): Workspace | null => mockWorkspacesById[workspaceId] ?? null,
);
