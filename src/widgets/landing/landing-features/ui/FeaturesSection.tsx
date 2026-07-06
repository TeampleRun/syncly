'use client';

// 기능 소개 섹션 — 좌측 헤딩 옆에서 기능 카드 트랙이 자동 캐러셀로 순환한다
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/shared/lib/utils';
import { fadeUp, staggerContainer, VIEWPORT_ONCE } from '@/shared/lib/motion';
import { featureCards } from '../config/features';
import type { FeatureCard } from '../config/features';

const CARD_STYLES: Record<FeatureCard['variant'], string> = {
  light: 'items-start bg-white px-10 py-7.5 drop-shadow-[0px_0px_7.5px_rgba(91,78,232,0.1)]',
  accent: 'bg-brand items-start px-10 py-7.5 drop-shadow-[0px_0px_7.5px_rgba(91,78,232,0.1)]',
  soft: 'bg-brand-surface items-center justify-center p-7.5 text-center',
};

const AUTO_ROTATE_MS = 2400;
const CARD_WIDTH = 300;
const CARD_GAP = 30;
const VISIBLE_CARD_COUNT = 3;
const RESET_INDEX = featureCards.length % 2 === 0 ? featureCards.length : featureCards.length * 2;
const carouselCards = [
  ...featureCards,
  ...(featureCards.length % 2 === 0 ? [] : featureCards),
  ...featureCards.slice(0, VISIBLE_CARD_COUNT),
];

function getDisplayVariant(index: number): FeatureCard['variant'] {
  return index % 2 === 0 ? 'light' : 'accent';
}

export default function FeaturesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInstantReset, setIsInstantReset] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => currentIndex + 1);
    }, AUTO_ROTATE_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (!isInstantReset) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setIsInstantReset(false);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [isInstantReset]);

  const handleAnimationComplete = () => {
    if (activeIndex !== RESET_INDEX) {
      return;
    }

    setIsInstantReset(true);
    setActiveIndex(0);
  };

  return (
    <section id="features" className="bg-brand-surface py-20 lg:py-30">
      <div className="mx-auto flex max-w-350 flex-col items-start gap-7.5 px-6 sm:px-16 lg:flex-row lg:items-center lg:gap-12.5 lg:pr-0">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="flex shrink-0 flex-col gap-6.25"
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
          className="w-full min-w-0 overflow-hidden py-4 pl-1.25"
          aria-live="polite"
        >
          <motion.div
            animate={{ x: -activeIndex * (CARD_WIDTH + CARD_GAP) }}
            transition={isInstantReset ? { duration: 0 } : { duration: 0.6, ease: 'easeInOut' }}
            onAnimationComplete={handleAnimationComplete}
            className="flex gap-7.5"
          >
            {carouselCards.map((feature, index) => {
              const displayVariant = getDisplayVariant(index);
              const isClonedCard = index >= RESET_INDEX;

              return (
                <motion.article
                  key={`${feature.title}-${index}`}
                  variants={fadeUp}
                  aria-hidden={isClonedCard}
                  className={cn(
                    'flex size-75 shrink-0 flex-col gap-3.75 rounded-[30px]',
                    CARD_STYLES[displayVariant],
                  )}
                >
                  <div
                    className={cn(
                      'flex items-center justify-center rounded-[15px]',
                      displayVariant === 'accent' && 'size-12.5 bg-[rgba(249,250,255,0.16)]',
                      displayVariant === 'light' && 'bg-brand-surface size-12.5',
                    )}
                  >
                    <feature.icon
                      className={cn(
                        displayVariant === 'accent' ? 'text-white' : 'text-brand',
                        'size-6.25',
                      )}
                    />
                  </div>
                  <h3
                    className={cn(
                      'text-2xl leading-[1.4] font-bold tracking-[-0.6px]',
                      displayVariant === 'accent' ? 'text-white' : 'text-brand-ink',
                    )}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={cn(
                      'text-lg leading-[1.6] tracking-[-0.45px]',
                      displayVariant === 'accent' ? 'text-[#c6c8e3]' : 'text-brand-muted',
                    )}
                  >
                    {feature.descriptionLines[0]}
                    <br />
                    {feature.descriptionLines[1]}
                  </p>
                </motion.article>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
