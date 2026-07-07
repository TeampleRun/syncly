// Supabase 워크스페이스 데이터 연결 전 shell에서 사용하는 워크스페이스 타입입니다.
import type { WorkspacePurpose } from '@/shared/dashboard/model/template';

export interface Workspace {
  id: string;
  name: string;
  /** 워크스페이스 용도 = 대시보드 템플릿 선택 키 (WORKSPACES.purpose) */
  purpose: WorkspacePurpose;
}
