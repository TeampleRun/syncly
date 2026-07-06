// get_my_workspaces RPC의 Mock 구현
// 백엔드 준비 시 supabase.rpc('get_my_workspaces') 호출로 교체한다 (반환 shape 동일)
import type { WorkspaceSummary } from '../model/types';

// updated_at은 호출 시점 기준 상대값으로 생성해 "최근 활동" 표기가 자연스럽게 유지되도록 한다
type MockWorkspaceSeed = Omit<WorkspaceSummary, 'updated_at' | 'progress'> & {
  activityMinutesAgo: number;
};

const MOCK_WORKSPACE_SEEDS: MockWorkspaceSeed[] = [
  {
    id: 'ws-capstone-design',
    name: '캡스톤 디자인 팀',
    purpose: 'team_project',
    member_count: 5,
    task_count: 12,
    done_task_count: 7,
    activityMinutesAgo: 10,
  },
  {
    id: 'ws-fitto-app',
    name: 'Fitto 앱 개발팀',
    purpose: 'side_project',
    member_count: 4,
    task_count: 24,
    done_task_count: 18,
    activityMinutesAgo: 60,
  },
  {
    id: 'ws-cafe-gray',
    name: '카페 그레이 운영',
    purpose: 'store',
    member_count: 6,
    task_count: 8,
    done_task_count: 5,
    activityMinutesAgo: 180,
  },
];

export async function getMyWorkspaces(): Promise<WorkspaceSummary[]> {
  const now = Date.now();

  return MOCK_WORKSPACE_SEEDS.map(({ activityMinutesAgo, ...summary }) => ({
    ...summary,
    progress:
      summary.task_count === 0
        ? 0
        : Math.round((summary.done_task_count / summary.task_count) * 100),
    updated_at: new Date(now - activityMinutesAgo * 60_000).toISOString(),
  }));
}
