// Supabase 환경 변수 접근 — 누락 시 초기에 바로 실패시켜 원인 파악을 쉽게 한다
export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY 환경 변수가 필요합니다 (.env.local 확인 — 양식은 .env.example 참고)',
    );
  }

  return { url, publishableKey };
}
