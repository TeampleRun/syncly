'use client';

// 랜딩 히어로 섹션 — 좌측 텍스트가 순차 등장하고 우측 UI 목업 일러스트가 배경으로 깔린다
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { fadeUp, staggerContainer } from '@/shared/lib/motion';

// Figma 원본 버튼 그림자 값 — Tailwind 기본 shadow와 달라 임의값으로 유지한다
const PRIMARY_BUTTON_SHADOW = '0px 10px 7.5px #c6d2ff, 0px 4px 3px #c6d2ff';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <Image
        src="/landing/hero-bg.png"
        alt=""
        fill
        priority
        className="pointer-events-none object-cover"
      />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative mx-auto flex max-w-[1400px] flex-col items-start gap-[30px] px-6 py-20 sm:px-16 lg:py-40"
      >
        <motion.span
          variants={fadeUp}
          className="border-brand-soft text-brand inline-flex items-center gap-[5px] rounded-full border bg-white px-[13px] py-[7px] text-[13px] font-semibold tracking-[-0.325px]"
        >
          <Sparkles className="size-3" />
          소규모 팀을 위한 맞춤형 협업 플랫폼
        </motion.span>
        <motion.h1
          variants={fadeUp}
          className="flex flex-col gap-[3px] text-4xl leading-[1.4] font-extrabold tracking-[-1.2px] sm:text-5xl"
        >
          <span className="text-brand-ink">협업은 더 가볍게</span>
          <span className="animate-gradient-x from-brand-start via-brand-end to-brand-start bg-linear-to-r bg-[length:200%_auto] bg-clip-text text-transparent">
            성과는 더 빠르게
          </span>
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="text-brand-muted max-w-xl text-lg leading-[1.6] tracking-[-0.45px]"
        >
          팀플, 사이드 프로젝트, 소규모 매장 운영까지.
          <br />
          템플릿 하나면 필요한 협업 화면이 자동으로 구성됩니다.
        </motion.p>
        <motion.div variants={fadeUp} className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/login"
            className="bg-brand flex h-[52px] w-full items-center justify-center gap-2 rounded-[15px] px-[25px] py-3 text-base font-semibold tracking-[-0.4px] text-white transition-transform hover:scale-103 sm:w-auto"
            style={{ boxShadow: PRIMARY_BUTTON_SHADOW }}
          >
            지금 시작하기
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="#features"
            className="text-brand-ink hover:bg-brand-secondary flex h-[52px] w-full items-center justify-center rounded-[15px] bg-white px-[25px] py-3 text-base font-semibold tracking-[-0.4px] transition-colors sm:w-auto"
          >
            데모 보기
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
