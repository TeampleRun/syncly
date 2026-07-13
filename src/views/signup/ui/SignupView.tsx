'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { Eye, EyeOff, Loader2 } from 'lucide-react';

import { createClient } from '@/shared/lib/client';
import { useOAuthSignIn } from '@/shared/lib/use-oauth-sign-in';
import { Input } from '@/shared/ui/input';

const INPUT_CLASS =
  'h-11 rounded-[18px] border-2 border-transparent bg-brand-secondary px-4 text-sm text-brand-ink placeholder:text-brand-ink/50 transition-colors focus-visible:border-brand focus-visible:ring-0';

type Step = 'email' | 'otp' | 'info' | 'done';

const STEP_TITLE: Record<Step, string> = {
  email: 'Syncly 시작하기',
  otp: '인증번호 입력',
  info: '사용자 정보 입력',
  done: '가입이 완료됐어요',
};

const OTP_SECONDS = 180;

const AUTH_ERROR_MAP: Record<string, string> = {
  'User already registered': '이미 가입된 이메일이에요',
  'Password should be at least 6 characters': '비밀번호는 6자 이상으로 입력해주세요',
  'Unable to validate email address': '올바른 이메일 형식이 아니에요',
  'Token has expired or is invalid': '인증번호가 만료됐거나 올바르지 않아요',
  'Email rate limit exceeded': '잠시 후 다시 시도해주세요',
  'too many requests': '잠시 후 다시 시도해주세요',
  over_email_send_rate_limit: '잠시 후 다시 시도해주세요',
};

function toKoreanError(message: string): string {
  const matched = Object.entries(AUTH_ERROR_MAP).find(([key]) =>
    message.toLowerCase().includes(key.toLowerCase()),
  );
  return matched ? matched[1] : '오류가 발생했어요. 다시 시도해주세요';
}

function formatTimer(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function SignupView() {
  const supabase = createClient();
  const router = useRouter();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(OTP_SECONDS);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { signInWithOAuth, oauthError, oauthLoading } = useOAuthSignIn();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase
        .from('profiles')
        .select('real_name')
        .eq('id', user.id)
        .maybeSingle();
      if (profile?.real_name) {
        router.push('/workspaces');
      } else {
        setStep('info');
      }
    };
    checkSession();
  }, []);

  const startTimer = () => {
    setTimer(OTP_SECONDS);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
    },
    [],
  );

  const handleEmailNext = async () => {
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    if (error) {
      setError(toKoreanError(error.message));
    } else {
      setStep('otp');
      startTimer();
    }
    setLoading(false);
  };

  const handleOtpVerify = async () => {
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    });
    if (error) {
      setError(toKoreanError(error.message));
    } else {
      setStep('info');
    }
    setLoading(false);
  };

  const handleResendOtp = async () => {
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    if (error) {
      setError(toKoreanError(error.message));
    } else {
      startTimer();
    }
    setLoading(false);
  };

  const handleInfoSubmit = async () => {
    setError(null);
    const realName = name.trim();
    if (!realName) {
      setError('이름을 입력해주세요');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password,
      data: { full_name: realName },
    });
    if (error) {
      setError(toKoreanError(error.message));
    } else {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setError('가입 정보를 확인하지 못했어요. 다시 시도해주세요');
      } else {
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: user.id,
          email: user.email!,
          real_name: realName,
          avatar_url: null,
        });
        if (profileError) {
          setError('프로필 저장에 실패했어요. 다시 시도해주세요');
        } else {
          setStep('done');
        }
      }
    }
    setLoading(false);
  };

  return (
    <div className="bg-brand-surface flex min-h-screen items-center justify-center px-4">
      <div className="flex w-full max-w-[384px] flex-col items-stretch gap-5">
        <div className="flex flex-col items-center gap-4">
          <Image src="/images/auth/login-symbol.png" alt="Syncly" width={33} height={47} priority />
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-brand-ink text-2xl font-bold">{STEP_TITLE[step]}</h1>
            <p className="text-brand-muted text-center text-sm">
              {step === 'email' && '소규모 팀을 위한 가벼운 협업 공간'}
              {step === 'otp' && (
                <>
                  {email}로<br />
                  인증번호를 보냈어요
                </>
              )}
              {step === 'info' && email}
              {step === 'done' && '이제 워크스페이스를 만들어보세요'}
            </p>
          </div>
        </div>

        {step === 'email' && (
          <div className="border-brand/10 flex flex-col gap-3 rounded-[16px] border bg-white p-6 shadow-sm">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEmailNext();
              }}
              className="flex flex-col gap-3"
            >
              <Input
                type="email"
                placeholder="이메일 주소"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={INPUT_CLASS}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="bg-brand hover:bg-brand/90 flex h-12 w-full items-center justify-center rounded-[18px] text-base font-semibold text-white transition-colors disabled:pointer-events-none disabled:opacity-60"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : '다음'}
              </button>
            </form>

            <div className="flex items-center gap-3 py-1">
              <div className="bg-brand/10 h-px flex-1" />
              <span className="text-brand-muted text-xs">또는</span>
              <div className="bg-brand/10 h-px flex-1" />
            </div>

            <button
              onClick={() => signInWithOAuth('google')}
              disabled={loading || oauthLoading}
              className="border-brand/10 text-brand-ink hover:bg-brand-surface flex h-11 w-full items-center gap-3 rounded-[18px] border px-5 text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-60"
            >
              <Image src="/images/auth/icon-google.svg" alt="" width={21} height={20} />
              <span className="flex-1 text-center">Google로 계속하기</span>
            </button>
            <button
              onClick={() => signInWithOAuth('github')}
              disabled={loading || oauthLoading}
              className="border-brand/10 text-brand-ink hover:bg-brand-surface flex h-11 w-full items-center gap-3 rounded-[18px] border px-5 text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-60"
            >
              <Image src="/images/auth/icon-github.svg" alt="" width={21} height={20} />
              <span className="flex-1 text-center">GitHub로 계속하기</span>
            </button>
            {oauthError && <p className="text-sm text-red-500">{oauthError}</p>}
          </div>
        )}

        {step === 'otp' && (
          <div className="border-brand/10 flex flex-col gap-3 rounded-[16px] border bg-white p-6 shadow-sm">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleOtpVerify();
              }}
              noValidate
              className="flex flex-col gap-3"
            >
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="인증번호를 입력해 주세요."
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    className={`${INPUT_CLASS} pr-16`}
                  />
                  <span
                    className={`absolute top-1/2 right-4 -translate-y-1/2 text-sm font-semibold ${timer === 0 ? 'text-red-400' : 'text-brand'}`}
                  >
                    {formatTimer(timer)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading || timer > 0}
                  className={`h-11 shrink-0 rounded-[18px] border px-4 text-sm font-semibold transition-colors ${
                    timer === 0
                      ? 'border-brand text-brand hover:bg-brand hover:text-white'
                      : 'border-brand-secondary text-brand-muted/40 cursor-not-allowed'
                  }`}
                >
                  재발송
                </button>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button
                type="submit"
                disabled={loading || otp.length < 6 || timer === 0}
                className="bg-brand hover:bg-brand/90 flex h-12 w-full items-center justify-center rounded-[18px] text-base font-semibold text-white transition-colors disabled:pointer-events-none disabled:opacity-60"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : '인증하기'}
              </button>
            </form>
          </div>
        )}

        {step === 'info' && (
          <div className="border-brand/10 flex flex-col gap-3 rounded-[16px] border bg-white p-6 shadow-sm">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleInfoSubmit();
              }}
              noValidate
              className="flex flex-col gap-3"
            >
              <Input
                type="text"
                placeholder="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={INPUT_CLASS}
              />
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="비밀번호 (6자 이상)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className={`${INPUT_CLASS} pr-11`}
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
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="bg-brand hover:bg-brand/90 flex h-12 w-full items-center justify-center rounded-[18px] text-base font-semibold text-white transition-colors disabled:pointer-events-none disabled:opacity-60"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : '가입하기'}
              </button>
            </form>
          </div>
        )}

        {step === 'done' && (
          <Link
            href="/workspaces"
            className="bg-brand hover:bg-brand/90 flex h-12 w-full items-center justify-center rounded-[18px] text-base font-semibold text-white transition-colors"
          >
            시작하기
          </Link>
        )}

        {step !== 'done' && (
          <div className="flex items-center justify-between">
            {step === 'email' && (
              <Link
                href="/"
                className="text-brand-muted hover:text-brand-ink text-sm transition-colors"
              >
                ← 홈으로
              </Link>
            )}
            {(step === 'otp' || step === 'info') && (
              <button
                onClick={() => {
                  setStep(step === 'otp' ? 'email' : 'otp');
                  setError(null);
                }}
                className="text-brand-muted hover:text-brand-ink text-sm transition-colors"
              >
                ← 이전
              </button>
            )}
            {step === 'email' && (
              <p className="text-brand-muted text-sm">
                이미 계정이 있으신가요?{' '}
                <Link href="/login" className="text-brand font-semibold underline">
                  로그인
                </Link>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
