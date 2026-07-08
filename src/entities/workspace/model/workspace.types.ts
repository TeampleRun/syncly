// Supabase 워크스페이스 데이터 연결 전 shell에서 사용하는 워크스페이스 타입입니다.
export type WorkspacePurpose = 'team-project' | 'side-project' | 'store-operation';

export interface Workspace {
  id: string;
  name: string;
  purpose: WorkspacePurpose;
}

// get_my_workspaces RPC 반환 형태 (내 워크스페이스 목록)
// - *_count와 progress는 서버에서 계산되어 내려온다 (progress = done_task_count / task_count * 100, 미저장)
// - updated_at은 workspaces.updated_at으로, 카드의 "최근 활동" 표기에 사용한다
export interface WorkspaceSummary {
  id: string;
  name: string;
  purpose: WorkspacePurpose;
  member_count: number;
  task_count: number;
  done_task_count: number;
  progress: number;
  updated_at: string;
}
