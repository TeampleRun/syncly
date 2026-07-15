// 회의록 수정·삭제 액션이 공유하는 권한 확인 헬퍼입니다.
// 'use server'가 아닌 일반 서버 모듈로, 서버 액션에서만 import 합니다.
import { getCurrentUserId } from '@/shared/api/supabase/current-user';
import { createSupabaseServerClient } from '@/shared/api/supabase/server';

type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

interface AuthorizedContext {
  supabase: SupabaseServerClient;
  currentUserId: string;
}

// 대상 회의록이 존재하고, 현재 사용자가 작성자이거나 워크스페이스 소유자인지 확인한다.
// RLS로도 막히지만, 명확한 메시지와 supabase 컨텍스트 재사용을 위해 액션에서 먼저 검증한다.
export async function authorizeMeetingNoteMutation(input: {
  workspaceId: string;
  meetingNoteId: string;
}): Promise<{ ok: true; context: AuthorizedContext } | { ok: false; message: string }> {
  const supabase = await createSupabaseServerClient();
  const currentUserId = await getCurrentUserId();

  const [{ data: note, error: noteError }, { data: membership, error: memberError }] =
    await Promise.all([
      supabase
        .from('meeting_notes')
        .select('id, author_id')
        .eq('id', input.meetingNoteId)
        .eq('workspace_id', input.workspaceId)
        .maybeSingle(),
      supabase
        .from('workspace_members')
        .select('user_id, role')
        .eq('workspace_id', input.workspaceId)
        .eq('user_id', currentUserId)
        .maybeSingle(),
    ]);

  if (noteError || memberError) {
    console.error('[meeting-note] 권한 확인 실패:', noteError ?? memberError);
    return { ok: false, message: '회의록 정보를 확인하지 못했습니다.' };
  }

  if (!membership) {
    return { ok: false, message: '워크스페이스 멤버만 회의록을 관리할 수 있습니다.' };
  }

  if (!note) {
    return { ok: false, message: '회의록을 찾을 수 없습니다.' };
  }

  if (membership.role !== 'owner' && note.author_id !== currentUserId) {
    return {
      ok: false,
      message: '작성자 또는 워크스페이스 소유자만 회의록을 수정하거나 삭제할 수 있습니다.',
    };
  }

  return { ok: true, context: { supabase, currentUserId } };
}
