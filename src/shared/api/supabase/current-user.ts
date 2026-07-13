// 서버에서 현재 인증 사용자를 조회하고, 개발 환경에서만 테스트 사용자로 대체합니다.
import { DEV_USER_ID } from '@/shared/config/dev-user';
import { createSupabaseServerClient } from './server';

export async function getCurrentUserId(): Promise<string> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) return user.id;

  if (process.env.NODE_ENV !== 'production') {
    return DEV_USER_ID;
  }

  throw new Error('인증된 사용자가 필요합니다.');
}
