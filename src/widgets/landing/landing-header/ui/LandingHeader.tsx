'use client';

// 랜딩 상단 네비게이션 — 스크롤 시 배경 블러와 그림자가 나타나는 sticky 헤더
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const SCROLL_THRESHOLD = 8;

export default function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-all duration-300',
        isScrolled
          ? 'border-brand/10 bg-white/80 shadow-sm backdrop-blur-md'
          : 'border-brand/10 bg-white',
      )}
    >
      <nav className="flex items-center justify-between px-6 pt-4 pb-4.25 sm:px-16">
        <div className="flex items-center gap-2">
          <Image src="/images/header/logo.svg" alt="Syncly" width={100} height={100} />
        </div>
        <div className="flex items-center gap-2.5 sm:gap-5">
          <Link
            href="/login"
            className="border-brand-muted text-brand-muted hover:border-brand-ink hover:text-brand-ink rounded-full border px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition-colors sm:px-5"
          >
            로그인
          </Link>
          <Link
            href="/signUp"
            className="bg-brand hover:bg-brand-deep flex items-center gap-0.75 rounded-[18px] px-3.5 py-2 text-sm font-semibold whitespace-nowrap text-white transition-colors sm:px-5"
          >
            무료로 시작하기
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
