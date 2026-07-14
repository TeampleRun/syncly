// 초대 참여 라우트 — 초대 코드로 워크스페이스 요약을 조회해 참여 화면을 보여준다.
// 비멤버는 RLS로 워크스페이스를 직접 조회할 수 없어 security definer RPC(get_invite_preview)를 사용한다.
import Link from 'next/link';
import { getInvitePreview } from '@/entities/workspace/api/get-invite-preview';
import { plusJakartaSans } from '@/shared/lib/fonts';
import { InviteAcceptView } from '@/views/invite';

interface InvitePageProps {
  params: Promise<{ code: string }>;
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { code } = await params;
  const preview = await getInvitePreview(code);

  if (!preview) {
    return (
      <div
        className={`${plusJakartaSans.className} flex min-h-dvh items-center justify-center px-4`}
      >
        <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-950">유효하지 않은 초대예요</h1>
          <p className="mt-2 text-sm text-slate-500">
            링크가 만료되었거나 초대가 비활성화되었을 수 있어요. 초대한 사람에게 새 링크를
            요청해 주세요.
          </p>
          <Link
            href="/workspaces"
            className="mt-8 inline-flex h-11 items-center justify-center rounded-2xl bg-[var(--color-brand)] px-5 text-sm font-bold text-white hover:bg-indigo-500"
          >
            내 워크스페이스로
          </Link>
        </section>
      </div>
    );
  }

  return (
    <InviteAcceptView
      code={code}
      workspaceName={preview.name}
      memberCount={preview.memberCount}
    />
  );
}
