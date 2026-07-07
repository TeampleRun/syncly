// 워크스페이스 공통 레이아웃 — 사이드 프로젝트 하위 모든 페이지(대시보드/보드/캘린더 등)를
// AppShell(사이드바·탑바 슬롯 + 메인)로 감싼다. 실제 사이드바/탑바 컴포넌트가 완성되면
// 여기 AppShell의 sidebar/topbar props에 연결하면 전 페이지에 반영된다.
import { Plus_Jakarta_Sans } from 'next/font/google';

import { WorkspaceShell } from '@/widgets/workspace-shell';

// Figma 지정 폰트 (랜딩과 동일) — 한글은 시스템 폰트로 fallback
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
});
interface WorkspaceLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    workspaceId: string;
  }>;
}

export default async function WorkspaceLayout({ children, params }: WorkspaceLayoutProps) {
  const { workspaceId } = await params;

  return (
    <div className={jakarta.className}>
      <WorkspaceShell workspaceId={workspaceId}>{children}</WorkspaceShell>;
    </div>
  );
}
