'use client';

// 팀 유형 소개 섹션 — 팀플/사이드 프로젝트/매장 운영 카드가 스크롤 진입 시 순차 등장한다
import { motion } from 'motion/react';
import { fadeUp, hoverLift, staggerContainer, VIEWPORT_ONCE } from '@/shared/lib/motion';
import { teamCards } from '../config/teams';

export default function TeamsSection() {
  return (
    <section className="bg-brand-surface px-6 py-12 sm:px-16">
      <div className="mx-auto max-w-5xl">
        <p className="text-brand-muted text-center text-xs font-bold tracking-[1.2px] uppercase">
          어떤 팀인가요?
        </p>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="mt-8 grid gap-5 md:grid-cols-3"
        >
          {teamCards.map((team) => (
            <motion.article
              key={team.title}
              variants={fadeUp}
              whileHover={hoverLift}
              className="rounded-2xl border bg-white p-[25px]"
              style={{ borderColor: team.borderColor }}
            >
              <div
                className="flex size-11 items-center justify-center rounded-[18px]"
                style={{ background: team.gradient }}
              >
                <team.icon className="size-5 text-white" />
              </div>
              <h3 className="text-brand-ink mt-4 text-lg leading-[27px] font-bold">{team.title}</h3>
              <p className="text-brand-muted mt-1 text-xs leading-4">{team.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {team.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full px-2 py-0.5 text-xs font-semibold"
                    style={{ backgroundColor: team.tagBg, color: team.tagText }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
