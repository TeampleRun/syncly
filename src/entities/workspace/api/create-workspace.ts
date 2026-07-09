'use server';

// 워크스페이스 생성 서버액션 — create_workspace RPC
// (RPC가 workspaces + owner 멤버십 + purpose별 기본 모듈 + invite_code 생성을 한 트랜잭션으로 처리)
import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import { DEV_USER_ID } from '@/shared/config/dev-user';
import {
  createWorkspaceInputSchema,
  type CreateWorkspaceInput,
} from '../model/create-workspace.schema';
import { toDbPurpose } from '../model/purpose.mapper';

export async function createWorkspace(input: CreateWorkspaceInput): Promise<{ id: string }> {
  // 클라이언트(rhf+zod) 검증과 별개로 서버에서 재검증한다
  const parsed = createWorkspaceInputSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? '입력값이 올바르지 않습니다');
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc('create_workspace', {
    p_user_id: DEV_USER_ID,
    p_name: parsed.data.name,
    p_purpose: toDbPurpose(parsed.data.purpose),
    ...(parsed.data.description ? { p_description: parsed.data.description } : {}),
  });

  if (error) {
    throw new Error(`워크스페이스 생성에 실패했습니다: ${error.message}`);
  }

  return { id: data };
}
