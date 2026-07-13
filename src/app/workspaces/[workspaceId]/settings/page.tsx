// 설정 페이지 라우트 — 활성 탭을 searchParam(?tab=)으로 읽고, 표시에 필요한 데이터를 RSC에서 조회해 주입한다.
// 실 API 전환 시 아래 조회부만 async(Supabase)로 교체하면 되고, 하위 뷰/훅은 그대로 둔다.
import { notFound } from 'next/navigation';
import { getWorkspaceById } from '@/entities/workspace/api/get-workspace-by-id';
import {
  getMockWorkspaceMembersByWorkspaceId,
  mockCurrentWorkspaceMember,
} from '@/entities/workspace-member';
import { SettingsView, parseSettingsTab } from '@/views/settings';

interface WorkspaceSettingsPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
  searchParams: Promise<{
    tab?: string;
  }>;
}

export default async function WorkspaceSettingsPage({
  params,
  searchParams,
}: WorkspaceSettingsPageProps) {
  const { workspaceId } = await params;
  const { tab } = await searchParams;
  const workspace = await getWorkspaceById(workspaceId);

  if (!workspace) {
    notFound();
  }

  const members = getMockWorkspaceMembersByWorkspaceId(workspaceId);

  return (
    <SettingsView
      workspace={workspace}
      workspaceId={workspaceId}
      activeTab={parseSettingsTab(tab)}
      members={members}
      currentUserId={mockCurrentWorkspaceMember.userId}
      currentNickname={mockCurrentWorkspaceMember.workspaceNickname}
    />
  );
}
