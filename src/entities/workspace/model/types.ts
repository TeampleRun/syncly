// 워크스페이스 도메인 타입 — Syncly ERD 정합
// 템플릿 테이블을 두지 않고 workspaces.purpose 값으로 목적을 구분한다
export type WorkspacePurpose = 'team_project' | 'side_project' | 'store' | 'custom';

// get_my_workspaces RPC 반환 형태
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
