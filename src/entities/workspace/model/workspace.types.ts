// Supabase 워크스페이스 데이터 연결 전 shell에서 사용하는 워크스페이스 타입입니다.
export type WorkspacePurpose = 'team-project' | 'side-project' | 'store-operation';

export interface Workspace {
  id: string;
  name: string;
  purpose: WorkspacePurpose;
}
