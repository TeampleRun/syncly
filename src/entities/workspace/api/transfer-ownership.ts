'use server';

// 워크스페이스 소유권 이전 서버액션 — transfer_workspace_ownership RPC 호출
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createSupabaseServerClient } from '@/shared/api/supabase/server';

const transferOwnershipInputSchema = z.object({
  workspaceId: z.guid(),
  newOwnerUserId: z.guid(),
});

export type TransferOwnershipInput = z.infer<typeof transferOwnershipInputSchema>;

export async function transferOwnership(input: TransferOwnershipInput): Promise<void> {
  const parsed = transferOwnershipInputSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error('입력값이 올바르지 않습니다');
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc('transfer_workspace_ownership', {
    p_workspace_id: parsed.data.workspaceId,
    p_new_owner_id: parsed.data.newOwnerUserId,
  });

  if (error) {
    // 자기 자신 지정, 비멤버 대상 등 RPC가 던진 메시지를 그대로 전달한다.
    console.error('[transferOwnership] RPC 실패:', error);
    throw new Error(error.message || '소유권 이전에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }

  revalidatePath(`/workspaces/${parsed.data.workspaceId}/settings`);
}
