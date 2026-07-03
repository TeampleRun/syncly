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
      className="animate-gradient-x from-brand-start via-brand-deep to-brand-start bg-gradient-to-br bg-[length:200%_200%] px-6 py-16 text-center [animation-duration:10s] sm:px-16"
    >
      <motion.h2 variants={fadeUp} className="text-3xl font-extrabold text-white">
        지금 바로 무료로 시작하세요
      </motion.h2>
      <motion.p variants={fadeUp} className="mt-4 text-base text-white/80">
        신용카드 없이. 설치 없이. 복잡한 설정 없이.
      </motion.p>
      <motion.div variants={fadeUp} className="mt-8">
        <Link
          href="/login"
          className="text-brand inline-block rounded-[18px] bg-white px-6 py-3 text-base font-bold shadow-lg transition-transform hover:scale-[1.03]"
        >
          무료로 시작하기
        </Link>
      </motion.div>
    </motion.section>
  );
}
