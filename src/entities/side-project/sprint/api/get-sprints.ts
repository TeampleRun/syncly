// 워크스페이스의 스프린트 목록 조회 — Mock 구현.
// 백엔드 준비 시 supabase.from('sprints').select().eq('workspace_id', workspaceId).order('start_date') 로 교체한다.
// TODO(async): Supabase 전환 시 Promise 반환으로 바꾼다.
import type { Sprint } from '../model/sprint.types';
import { mockSprints } from '../model/sprint.mock';

export function getSprints(workspaceId: string): Sprint[] {
  return mockSprints.filter((sprint) => sprint.workspaceId === workspaceId);
}
