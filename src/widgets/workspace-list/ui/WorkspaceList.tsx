import type { WorkspaceSummary } from '@/entities/workspace';
import WorkspaceCard from './WorkspaceCard';
import EmptyWorkspaces from './EmptyWorkspaces';

interface WorkspaceListProps {
  workspaces: WorkspaceSummary[];
}

// 워크스페이스 목록 — 데이터가 있으면 카드 리스트, 없으면 빈 상태
export default function WorkspaceList({ workspaces }: WorkspaceListProps) {
  if (workspaces.length === 0) {
    return <EmptyWorkspaces />;
  }

  return (
    <div className="flex flex-col gap-3.75 pt-8">
      {workspaces.map((workspace) => (
        <WorkspaceCard key={workspace.id} workspace={workspace} />
      ))}
    </div>
  );
}
