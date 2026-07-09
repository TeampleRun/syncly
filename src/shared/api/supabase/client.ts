// 브라우저용 Supabase 클라이언트 — 모듈 스코프 싱글턴으로 재사용한다
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/shared/model/supabase.types';
import { getSupabaseEnv } from './env';

let client: ReturnType<typeof createBrowserClient<Database>> | undefined;

export function getSupabaseBrowserClient() {
  if (!client) {
    const { url, publishableKey } = getSupabaseEnv();
    client = createBrowserClient<Database>(url, publishableKey);
  }
  return client;
}
