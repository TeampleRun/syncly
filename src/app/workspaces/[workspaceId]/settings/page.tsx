// 설정 페이지 라우트 — 활성 탭을 searchParam(?tab=)으로 읽고, 표시에 필요한 데이터를 RSC에서 조회해 주입한다.
import { notFound } from 'next/navigation';
import { getWorkspaceById } from '@/entities/workspace/api/get-workspace-by-id';
import { getWorkspaceMembersByWorkspaceId } from '@/entities/workspace-member/api/get-workspace-members-by-id';
import { getCurrentUserId } from '@/shared/api/supabase/current-user';
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

  // 멤버 목록과 현재 사용자 식별자를 병렬 조회하고, 현재 사용자의 닉네임은 멤버 목록에서 파생한다.
  const [members, currentUserId] = await Promise.all([
    getWorkspaceMembersByWorkspaceId(workspaceId),
    getCurrentUserId(),
  ]);
  const currentNickname =
    members.find((member) => member.userId === currentUserId)?.workspaceNickname ?? '';

  return (
    <SettingsView
      workspace={workspace}
      workspaceId={workspaceId}
      activeTab={parseSettingsTab(tab)}
      members={members}
      currentUserId={currentUserId}
      currentNickname={currentNickname}
    />
  );
}
