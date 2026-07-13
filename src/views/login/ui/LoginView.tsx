'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import { createClient } from '@/shared/lib/client';
import { Input } from '@/shared/ui/input';

const AUTH_ERROR_MAP: Record<string, string> = {
  'Invalid login credentials': '이메일 또는 비밀번호가 올바르지 않아요',
  'Email not confirmed': '이메일 인증이 필요해요. 메일함을 확인해주세요',
  'User already registered': '이미 가입된 이메일이에요',
  'Password should be at least 6 characters': '비밀번호는 6자 이상으로 입력해주세요',
  'Unable to validate email address: invalid format': '올바른 이메일 형식이 아니에요',
  'signup requires a valid password': '비밀번호를 입력해주세요',
  'Email rate limit exceeded': '잠시 후 다시 시도해주세요',
  over_email_send_rate_limit: '잠시 후 다시 시도해주세요',
  'too many requests': '잠시 후 다시 시도해주세요',
};

function toKoreanError(message: string): string {
  const matched = Object.entries(AUTH_ERROR_MAP).find(([key]) =>
    message.toLowerCase().includes(key.toLowerCase()),
  );
  return matched ? matched[1] : '로그인 중 오류가 발생했어요. 다시 시도해주세요';
}

const CALLBACK_ERROR_MAP: Record<string, string> = {
  auth_failed: '소셜 로그인에 실패했어요. 다시 시도해주세요',
  session_exchange_failed: '인증 처리 중 오류가 발생했어요. 다시 시도해주세요',
  email_missing: 'OAuth 계정에서 이메일 정보를 확인할 수 없어요. 다른 방법으로 로그인해 주세요',
};

const SAVED_EMAIL_KEY = 'syncly_saved_email';

export default function LoginView() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackError = searchParams.get('error');
  const [email, setEmail] = useState(() =>
    typeof window !== 'undefined' ? (localStorage.getItem(SAVED_EMAIL_KEY) ?? '') : '',
  );
  const [password, setPassword] = useState('');
  const [rememberEmail, setRememberEmail] = useState(() =>
    typeof window !== 'undefined' ? !!localStorage.getItem(SAVED_EMAIL_KEY) : false,
  );
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(
    callbackError ? (CALLBACK_ERROR_MAP[callbackError] ?? '로그인 중 오류가 발생했어요') : null,
  );
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setError(toKoreanError(error.message));
      setLoading(false);
    }
  };

  const signInWithEmail = async () => {
    setEmailError(null);
    setPasswordError(null);
    setError(null);

    if (!email) {
      setEmailError('이메일을 입력해주세요');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('올바른 이메일 형식이 아니에요');
      return;
    }
    if (!password) {
      setPasswordError('비밀번호를 입력해주세요');
      return;
    }

    if (rememberEmail) {
      localStorage.setItem(SAVED_EMAIL_KEY, email);
    } else {
      localStorage.removeItem(SAVED_EMAIL_KEY);
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(toKoreanError(error.message));
    } else {
      const redirect = searchParams.get('redirect');
      router.push(redirect ?? '/workspaces');
    }
    setLoading(false);
  };

  return (
    <div className="bg-brand-surface flex min-h-screen items-center justify-center px-4">
      <div className="flex w-full max-w-[384px] flex-col items-stretch gap-5">
        <div className="flex flex-col items-center gap-4">
          <Image src="/images/auth/login-symbol.png" alt="Syncly" width={33} height={47} priority />
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-brand-ink text-2xl font-bold">Syncly에 오신 걸 환영해요</h1>
            <p className="text-brand-muted text-sm">소규모 팀을 위한 가벼운 협업 공간</p>
          </div>
        </div>

        <div className="border-brand/10 flex flex-col gap-3 rounded-[16px] border bg-white p-6 shadow-sm">
          <button
            onClick={() => handleOAuthSignIn('google')}
            disabled={loading}
            className="border-brand/10 text-brand-ink hover:bg-brand-surface flex h-11 w-full items-center gap-3 rounded-[18px] border px-5 text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-60"
          >
            <Image src="/images/auth/icon-google.svg" alt="" width={21} height={20} />
            <span className="flex-1 text-center">Google로 계속하기</span>
          </button>

          <button
            onClick={() => handleOAuthSignIn('github')}
            disabled={loading}
            className="border-brand/10 text-brand-ink hover:bg-brand-surface flex h-11 w-full items-center gap-3 rounded-[18px] border px-5 text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-60"
          >
            <Image src="/images/auth/icon-github.svg" alt="" width={21} height={20} />
            <span className="flex-1 text-center">GitHub로 계속하기</span>
          </button>

          <div className="flex items-center gap-3 py-1">
            <div className="bg-brand/10 h-px flex-1" />
            <span className="text-brand-muted text-xs">또는</span>
            <div className="bg-brand/10 h-px flex-1" />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              signInWithEmail();
            }}
            noValidate
            className="flex flex-col gap-3"
          >
            <div className="flex flex-col gap-1">
              <Input
                suppressHydrationWarning
                type="email"
                placeholder="이메일 주소"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(null);
                }}
                className={`bg-brand-secondary text-brand-ink placeholder:text-brand-ink/50 h-11 rounded-[18px] border-2 px-4 text-sm transition-colors focus-visible:ring-0 ${emailError ? 'border-red-400 focus-visible:border-red-400' : 'focus-visible:border-brand border-transparent'}`}
              />
              {emailError && <p className="px-1 text-sm text-red-500">{emailError}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(null);
                  }}
                  className={`bg-brand-secondary text-brand-ink placeholder:text-brand-ink/50 h-11 w-full rounded-[18px] border-2 px-4 pr-11 text-sm transition-colors focus-visible:ring-0 ${passwordError ? 'border-red-400 focus-visible:border-red-400' : 'focus-visible:border-brand border-transparent'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보이기'}
                  className="text-brand-muted hover:text-brand-ink absolute top-1/2 right-3 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordError && <p className="px-1 text-sm text-red-500">{passwordError}</p>}
            </div>

            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={rememberEmail}
                onChange={(e) => setRememberEmail(e.target.checked)}
                className="accent-brand h-4 w-4"
              />
              <span className="text-brand-muted text-sm">아이디 저장</span>
            </label>

            {error && <p className="px-1 text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="bg-brand hover:bg-brand/90 flex h-12 w-full items-center justify-center rounded-[18px] text-base font-semibold text-white transition-colors disabled:pointer-events-none disabled:opacity-60"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : '로그인'}
            </button>
          </form>
        </div>

        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-brand-muted hover:text-brand-ink text-sm transition-colors"
          >
            ← 홈으로
          </Link>
          <p className="text-brand-muted text-sm">
            아직 회원이 아니신가요?{' '}
            <Link href="/signup" className="text-brand font-semibold underline">
              가입하기
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
