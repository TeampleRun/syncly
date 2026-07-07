// 워크스페이스 조회 — Supabase 연결 전 목업을 반환한다.
// 서버 컴포넌트(RSC)에서 호출해 purpose 등 워크스페이스 메타를 얻는다.
import { mockWorkspace } from '../model/mock-workspace';
import type { Workspace } from '../model/workspace.types';

// TODO: DB 연동 — workspaceId로 WORKSPACES 조회
export async function getWorkspace(workspaceId: string): Promise<Workspace> {
  void workspaceId;
  return mockWorkspace;
}
