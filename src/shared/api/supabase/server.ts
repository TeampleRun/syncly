// 서버용 Supabase 클라이언트 — RSC/서버액션에서 요청 단위로 생성한다
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { Database } from '@/shared/model/supabase.types';
import { getSupabaseEnv } from './env';

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const { url, publishableKey } = getSupabaseEnv();

  return createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // RSC에서는 쿠키 쓰기가 불가 — auth 세션 갱신은 미들웨어 도입 시 처리한다
        }
      },
    },
  });
}
