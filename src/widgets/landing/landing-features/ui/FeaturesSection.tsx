'use client';

// 기능 소개 섹션 — 좌측 헤딩 옆으로 기능 카드가 가로 스크롤되며 순차 등장한다
import { motion } from 'motion/react';
import { cn } from '@/shared/lib/utils';
import { fadeUp, staggerContainer, VIEWPORT_ONCE } from '@/shared/lib/motion';
import { featureCards } from '../config/features';
import type { FeatureCard } from '../config/features';

const CARD_STYLES: Record<FeatureCard['variant'], string> = {
  light: 'items-start bg-white px-10 py-[30px] drop-shadow-[0px_0px_7.5px_rgba(91,78,232,0.1)]',
  accent:
    'items-start bg-[#6456f7] px-10 py-[30px] drop-shadow-[0px_0px_7.5px_rgba(91,78,232,0.1)]',
  soft: 'items-center justify-center bg-[#f9faff] p-[30px] text-center',
};

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-[#fbfcfd] py-20 lg:py-30">
      <div className="mx-auto flex max-w-[1400px] flex-col items-start gap-[30px] px-6 sm:px-16 lg:flex-row lg:items-center lg:gap-[50px] lg:pr-0">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="flex shrink-0 flex-col gap-[25px]"
        >
          <h2 className="text-brand-ink text-3xl leading-[1.4] font-bold tracking-[-0.9px] sm:text-4xl">
            <span className="text-brand">필요한 기능</span>이
            <br />한 곳에 모여 있어요
          </h2>
          <p className="text-brand-muted text-lg leading-[1.6] tracking-[-0.45px]">
            팀플, 사이드 프로젝트, 소규모 매장 운영까지.
            <br />
            템플릿 하나로 필요한 협업 기능이 자동으로 구성됩니다.
          </p>
        </motion.div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="flex w-full min-w-0 [scrollbar-width:thin] gap-[30px] overflow-x-auto py-4 pl-[5px]"
        >
          {featureCards.map((feature) => (
            <motion.article
              key={feature.title}
              variants={fadeUp}
              className={cn(
                'flex size-[300px] shrink-0 flex-col gap-[15px] rounded-[30px]',
                CARD_STYLES[feature.variant],
              )}
            >
              <div
                className={cn(
                  'flex items-center justify-center rounded-[15px]',
                  feature.variant === 'accent' && 'size-[50px] bg-[rgba(249,250,255,0.16)]',
                  feature.variant === 'light' && 'size-[50px] bg-[#f9faff]',
                  feature.variant === 'soft' && 'bg-brand-soft size-12',
                )}
              >
                <feature.icon
                  className={cn(
                    feature.variant === 'accent' ? 'text-white' : 'text-brand',
                    feature.variant === 'soft' ? 'size-6' : 'size-[25px]',
                  )}
                />
              </div>
              <h3
                className={cn(
                  'leading-[1.4] font-bold',
                  feature.variant === 'soft'
                    ? 'text-brand-ink text-xl tracking-[-0.5px]'
                    : 'text-2xl tracking-[-0.6px]',
                  feature.variant === 'accent' ? 'text-white' : 'text-brand-ink',
                )}
              >
                {feature.title}
              </h3>
              <p
                className={cn(
                  'leading-[1.6]',
                  feature.variant === 'soft'
                    ? 'text-brand-muted text-base tracking-[-0.4px]'
                    : 'text-lg tracking-[-0.45px]',
                  feature.variant === 'accent' ? 'text-[#c6c8e3]' : 'text-brand-muted',
                )}
              >
                {feature.descriptionLines[0]}
                <br />
                {feature.descriptionLines[1]}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
