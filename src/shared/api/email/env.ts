// 이메일(Resend) 환경 변수 접근 — 누락 시 초기에 바로 실패시켜 원인 파악을 쉽게 한다
export function getEmailEnv() {
  const apiKey = process.env.RESEND_API_KEY;
  // 발신 주소는 Resend에서 인증한 도메인이어야 한다. 미설정 시 테스트용 온보딩 주소로 폴백한다.
  const from = process.env.INVITE_EMAIL_FROM?.trim() || 'Syncly <onboarding@resend.dev>';

  if (!apiKey) {
    throw new Error(
      'RESEND_API_KEY 환경 변수가 필요합니다 (.env.local 확인 — 양식은 .env.example 참고)',
    );
  }

  return { apiKey, from };
}
