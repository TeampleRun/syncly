// 현재 워크스페이스 목적에서 제공하지 않는 모듈에 접근했을 때 안내하는 화면입니다.
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

interface WorkspaceUnavailableViewProps {
  workspaceId: string;
}

export function WorkspaceUnavailableView({ workspaceId }: WorkspaceUnavailableViewProps) {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-2xl items-center justify-center px-4 py-10 sm:px-8">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
          <ShieldAlert className="h-7 w-7" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-2xl font-bold text-slate-950">접근할 수 없는 페이지입니다.</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          현재 워크스페이스 템플릿에서는 이 기능을 사용할 수 없습니다.
        </p>
        <Link
          href={`/workspaces/${workspaceId}/dashboard`}
          className="mt-7 inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--color-brand)] px-4 text-sm font-bold text-white hover:bg-indigo-500"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          대시보드로 돌아가기
        </Link>
      </div>
    </section>
  );
}
