'use client';

// 하단 CTA 섹션 — 보라 그라데이션 배경이 천천히 흐르고 버튼이 호버에 반응한다
import { motion } from 'motion/react';
import Link from 'next/link';
import { fadeUp, staggerContainer, VIEWPORT_ONCE } from '@/shared/lib/motion';

export default function CtaSection() {
  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
      className="animate-gradient-x from-brand-start via-brand-deep to-brand-start flex flex-col items-center gap-[35px] bg-linear-to-br bg-[length:200%_200%] px-6 py-20 text-center [animation-duration:10s] sm:px-16 lg:py-25"
    >
      <div className="flex flex-col gap-[30px]">
        <motion.h2
          variants={fadeUp}
          className="text-3xl leading-[1.4] font-bold tracking-[-0.9px] text-white sm:text-4xl"
        >
          <span className="text-white/60">팀마다 다른 </span>협업
          <span className="text-white/60">, 시작은 더 </span>간단하게
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="text-lg leading-[1.6] tracking-[-0.45px] text-white/80"
        >
          설치 없이, 복잡한 설정 없이. 5분이면 우리 팀 워크 스페이스 완성!
          <br />
          상황에 맞는 템플릿으로 가장 쉬운 협업을 시작하세요.
        </motion.p>
      </div>
      <motion.div variants={fadeUp}>
        <Link
          href="/login"
          className="text-brand inline-block rounded-[15px] bg-white px-[25px] py-3 text-base font-bold tracking-[-0.4px] shadow-lg transition-transform hover:scale-103"
        >
          무료로 시작하기
        </Link>
      </motion.div>
    </motion.section>
  );
}
