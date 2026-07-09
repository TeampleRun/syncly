'use client';

// 내 워크스페이스 페이지 — 헤더 + 참여 중인 워크스페이스 목록(빈 상태 포함)을 조립한다
// 목록 조회는 tanstack-query(useQuery) — GET 컨벤션 (docs/conventions/supabase-convention.md)
import Link from 'next/link';
import { Plus, RotateCcw } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { useMyWorkspaces } from '@/entities/workspace';
import { WorkspaceList } from '@/widgets/workspace-list';

// Figma 지정 폰트 — 한글은 시스템 폰트로 fallback된다
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
});

export default function WorkspacesPage() {
  const { data: workspaces, isPending, isError, refetch } = useMyWorkspaces();

  return (
    <div className={`${jakarta.className} bg-brand-surface flex min-h-screen flex-col`}>
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-6">
        <header className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <h1 className="text-brand-ink text-xl leading-7 font-bold">내 워크스페이스</h1>
            <p className="text-brand-muted pt-0.5 text-sm leading-5">참여 중인 워크스페이스 목록</p>
          </div>
          <Link
            href="/workspaces/new"
            className="bg-brand flex shrink-0 items-center gap-2 rounded-[18px] px-4 py-2 text-sm font-semibold text-white"
          >
            <Plus className="size-4" aria-hidden />새 워크스페이스
          </Link>
        </header>

        {isPending ? (
          <div className="text-brand-muted flex flex-1 items-center justify-center text-sm">
            워크스페이스를 불러오는 중...
          </div>
        ) : isError ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3">
            <p className="text-brand-muted text-sm">워크스페이스 목록을 불러오지 못했습니다.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="text-brand flex items-center gap-1.5 text-sm font-semibold"
            >
              <RotateCcw className="size-4" aria-hidden />
              다시 시도
            </button>
          </div>
        ) : (
          <WorkspaceList workspaces={workspaces} />
        )}
      </div>
    </div>
  );
}
