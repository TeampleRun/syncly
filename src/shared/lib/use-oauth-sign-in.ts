import { useState } from 'react';

import { createClient } from '@/shared/lib/client';

const OAUTH_ERROR_MAP: Record<string, string> = {
  'Email rate limit exceeded': '잠시 후 다시 시도해주세요',
  'too many requests': '잠시 후 다시 시도해주세요',
  over_email_send_rate_limit: '잠시 후 다시 시도해주세요',
};

function toKoreanOAuthError(message: string): string {
  const matched = Object.entries(OAUTH_ERROR_MAP).find(([key]) =>
    message.toLowerCase().includes(key.toLowerCase()),
  );
  return matched ? matched[1] : '소셜 로그인 중 오류가 발생했어요. 다시 시도해주세요';
}

export function useOAuthSignIn() {
  const supabase = createClient();
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [oauthLoading, setOauthLoading] = useState(false);

  const signInWithOAuth = async (provider: 'google' | 'github') => {
    setOauthError(null);
    setOauthLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setOauthError(toKoreanOAuthError(error.message));
      setOauthLoading(false);
    }
  };

  return { signInWithOAuth, oauthError, oauthLoading };
}
