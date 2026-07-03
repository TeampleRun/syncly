'use client';

// 기능 소개 섹션 — 협업 기능 7종 카드가 스크롤 진입 시 그리드 순서대로 등장한다
import { motion } from 'motion/react';
import { fadeUp, staggerContainer, VIEWPORT_ONCE } from '@/shared/lib/motion';
import { featureCards } from '../config/features';

export default function FeaturesSection() {
  return (
    <section id="features" className="px-6 py-16 sm:px-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-brand-ink text-center text-3xl font-extrabold">
          필요한 협업 기능만 딱
        </h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          {featureCards.map((feature) => (
            <motion.article
              key={feature.title}
              variants={fadeUp}
              className="group bg-brand-surface flex flex-col items-center rounded-2xl p-5 text-center md:items-start md:text-left"
            >
              <div className="bg-brand-soft flex size-10 items-center justify-center rounded-[18px] transition-transform duration-300 group-hover:scale-110">
                <feature.icon className="text-brand size-5" />
              </div>
              <h3 className="text-brand-ink mt-3 text-sm font-bold">{feature.title}</h3>
              <p className="text-brand-muted mt-1 text-xs leading-[19.5px]">
                {feature.description}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
