'use client';

// 랜딩 상단 네비게이션 — 스크롤 시 배경 블러와 그림자가 나타나는 sticky 헤더
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Boxes } from 'lucide-react';
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
        'sticky top-0 z-10 border-b transition-all duration-300',
        isScrolled
          ? 'border-brand/10 bg-white/80 shadow-sm backdrop-blur-md'
          : 'border-transparent bg-white',
      )}
    >
      <nav className="flex items-center justify-between px-6 pt-4 pb-[17px] sm:px-16">
        <div className="flex items-center gap-2">
          <div className="from-brand-start to-brand-end flex size-8 items-center justify-center rounded-[18px] bg-gradient-to-br">
            <Boxes className="size-4 text-white" />
          </div>
          <span className="text-brand-ink text-lg font-extrabold tracking-[-0.45px]">Syncly</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-brand-muted hover:text-brand-ink text-sm font-semibold transition-colors"
          >
            로그인
          </Link>
          <Link
            href="/login"
            className="bg-brand hover:bg-brand-deep rounded-[18px] px-4 py-2 text-sm font-semibold text-white transition-colors"
          >
            무료로 시작
          </Link>
        </div>
      </nav>
    </header>
  );
}
