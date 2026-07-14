'use server';

// 이메일 초대 발송 서버액션 — 입력한 이메일로 초대 링크(invite_code)를 담은 메일을 보낸다.
// 초대 테이블/프로필 조회 없이 링크만 전달하므로, 수신자는 링크로 참여(/invite/[code])한다.
import { headers } from 'next/headers';
import { Resend } from 'resend';
import { z } from 'zod';
import { getEmailEnv } from '@/shared/api/email/env';
import { getWorkspaceById } from './get-workspace-by-id';

const sendInviteEmailInputSchema = z.object({
  workspaceId: z.guid(),
  email: z.email('올바른 이메일 주소를 입력해주세요'),
});

export type SendInviteEmailInput = z.infer<typeof sendInviteEmailInputSchema>;

// 서버에서 요청 헤더로 baseURL을 구성한다(클라이언트 origin에 의존하지 않음).
async function resolveOrigin(): Promise<string> {
  const headerList = await headers();
  const host = headerList.get('host');
  const proto = headerList.get('x-forwarded-proto') ?? 'http';
  return host ? `${proto}://${host}` : '';
}

export async function sendInviteEmail(input: SendInviteEmailInput): Promise<void> {
  const parsed = sendInviteEmailInputSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? '입력값이 올바르지 않습니다');
  }

  // RLS(workspaces_select_member)로 멤버만 조회 가능 → 비멤버의 발송을 차단한다.
  const workspace = await getWorkspaceById(parsed.data.workspaceId);
  if (!workspace) {
    throw new Error('워크스페이스를 찾을 수 없거나 접근 권한이 없습니다.');
  }

  if (!workspace.inviteEnabled || !workspace.inviteCode) {
    throw new Error('초대 링크를 먼저 활성화해주세요.');
  }

  const origin = await resolveOrigin();
  if (!origin) {
    throw new Error('초대 링크 주소를 확인할 수 없습니다. 잠시 후 다시 시도해주세요.');
  }

  const inviteUrl = `${origin}/invite/${workspace.inviteCode}`;
  const { apiKey, from } = getEmailEnv();
  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from,
    to: parsed.data.email,
    subject: `[Syncly] ${workspace.name} 워크스페이스에 초대되었어요`,
    text: `${workspace.name} 워크스페이스에 초대되었습니다.\n아래 링크로 참여하세요:\n${inviteUrl}`,
    html: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #0f172a;">
        <p><strong>${workspace.name}</strong> 워크스페이스에 초대되었어요.</p>
        <p>아래 버튼을 눌러 참여하세요.</p>
        <p style="margin: 24px 0;">
          <a href="${inviteUrl}"
             style="display:inline-block; padding:12px 20px; border-radius:12px; background:#6366f1; color:#fff; text-decoration:none; font-weight:bold;">
            워크스페이스 참여하기
          </a>
        </p>
        <p style="color:#64748b; font-size:13px;">버튼이 동작하지 않으면 이 링크를 복사해 열어주세요:<br>${inviteUrl}</p>
      </div>
    `,
  });

  if (error) {
    console.error('[sendInviteEmail] 발송 실패:', error);
    throw new Error('초대 메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }
}
