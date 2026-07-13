// 서버에서 현재 인증 사용자를 조회하고, 인증 연동 전에는 개발 테스트 사용자로 대체합니다.
import { DEV_USER_ID } from '@/shared/config/dev-user';
import { createSupabaseServerClient } from './server';

export async function getCurrentUserId(): Promise<string> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id ?? DEV_USER_ID;
}
