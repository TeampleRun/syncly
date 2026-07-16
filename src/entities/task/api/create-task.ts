'use server';

import { createSupabaseServerClient } from '@/shared/api/supabase/server';

import { taskTitleSchema } from '../model/task.schema';
import type { UntypedRpcClient } from './rpc-client';

function getTodayIsoDateInKst() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  if (!year || !month || !day) {
    throw new Error('현재 날짜를 계산하지 못했습니다.');
  }

  return `${year}-${month}-${day}`;
}

export async function createTask(params: { workspaceId: string; title: string }): Promise<void> {
  const parsedTitle = taskTitleSchema.safeParse(params.title);

  if (!parsedTitle.success) {
    throw new Error(parsedTitle.error.issues[0]?.message ?? '입력값이 올바르지 않습니다');
  }

  const supabase = await createSupabaseServerClient();
  const dueDate = getTodayIsoDateInKst();

  const { error } = await (supabase as unknown as UntypedRpcClient).rpc('create_task', {
    p_workspace_id: params.workspaceId,
    p_title: parsedTitle.data,
    p_due_date: dueDate,
  });

  if (error) {
    console.error('[task/createTask] RPC 실패:', error);
    throw new Error('업무 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }
}
