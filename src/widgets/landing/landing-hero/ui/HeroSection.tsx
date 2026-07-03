'use client';

// 랜딩 히어로 섹션 — 배지, 그라데이션 헤딩, CTA 버튼이 순차 등장한다
import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { fadeUp, staggerContainer } from '@/shared/lib/motion';

// Figma 원본 버튼 그림자 값 — Tailwind 기본 shadow와 달라 임의값으로 유지한다
const PRIMARY_BUTTON_SHADOW = '0px 10px 7.5px #c6d2ff, 0px 4px 3px #c6d2ff';

export default function HeroSection() {
  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="mx-auto flex max-w-[896px] flex-col items-center px-6 pt-20 pb-16 text-center sm:px-16"
    >
      <motion.span
        variants={fadeUp}
        className="bg-brand-soft text-brand mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
      >
        <Sparkles className="size-3" />
        소규모 팀을 위한 협업 플랫폼
      </motion.span>
      <motion.h1
        variants={fadeUp}
        className="text-brand-ink text-4xl leading-tight font-extrabold sm:text-5xl sm:leading-[60px]"
      >
        상황에 맞는 워크스페이스를
        <br />
        <span className="animate-gradient-x from-brand-start via-brand-end to-brand-start bg-gradient-to-r bg-[length:200%_auto] bg-clip-text text-transparent">
          바로 시작하세요
        </span>
      </motion.h1>
      <motion.p
        variants={fadeUp}
        className="text-brand-muted mt-5 max-w-xl text-lg leading-[29.25px]"
      >
        팀플, 사이드 프로젝트, 소규모 매장 운영까지.
        <br />
        템플릿 하나면 필요한 협업 화면이 자동으로 구성됩니다.
      </motion.p>
      <motion.div
        variants={fadeUp}
        className="mt-8 flex flex-wrap items-center justify-center gap-3"
      >
        <Link
          href="/login"
          className="bg-brand flex items-center gap-2 rounded-[18px] px-6 py-3 text-base font-semibold text-white transition-transform hover:scale-[1.03]"
          style={{ boxShadow: PRIMARY_BUTTON_SHADOW }}
        >
          지금 시작하기
          <ArrowRight className="size-4" />
        </Link>
        <Link
          href="#features"
          className="bg-brand-secondary text-brand-ink hover:bg-brand-soft rounded-[18px] px-6 py-3 text-base font-semibold transition-colors"
        >
          데모 보기
        </Link>
      </motion.div>
    </motion.section>
  );
}
