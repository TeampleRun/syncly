// create_workspace RPC의 Mock 구현
// 백엔드 준비 시 supabase.rpc('create_workspace')로 교체한다
// (실제로는 workspaces insert → invite_code 생성 → owner 등록 → purpose 기준 workspace_modules 생성 후 id 반환)
import type { WorkspacePurpose } from '../model/workspace.types';

export interface CreateWorkspaceInput {
  name: string;
  description?: string;
  purpose: WorkspacePurpose;
}

export async function createWorkspace(input: CreateWorkspaceInput): Promise<{ id: string }> {
  // Mock: 실제 저장 없이 워크스페이스 id만 생성해 반환한다
  const slug =
    input.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'workspace';

  return { id: `ws-${slug}-${Date.now().toString(36)}` };
}
