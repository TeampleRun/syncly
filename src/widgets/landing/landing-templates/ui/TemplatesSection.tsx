'use client';

// 템플릿 소개 섹션 — 좌측 리스트에서 템플릿을 선택하면 우측 미리보기 패널이 전환된다
import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { fadeUp, staggerContainer, VIEWPORT_ONCE } from '@/shared/lib/motion';
import { templateItems } from '../config/templates';

export default function TemplatesSection() {
  const [selectedId, setSelectedId] = useState(templateItems[0].id);
  const selected = templateItems.find((item) => item.id === selectedId) ?? templateItems[0];

  return (
    <section className="bg-white px-6 py-20 sm:px-16 lg:py-30">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="mx-auto flex max-w-[1400px] flex-col items-center gap-[30px] lg:flex-row"
      >
        <motion.div
          variants={fadeUp}
          className="flex w-full shrink-0 flex-col gap-[30px] lg:w-[450px]"
        >
          <div className="flex flex-col gap-[25px]">
            <h2 className="text-brand-ink text-3xl leading-[1.4] font-bold tracking-[-0.9px] sm:text-4xl">
              어떤 목적이든,
              <br />
              <span className="text-brand">맞춤 템플릿</span>으로 시작하세요
            </h2>
            <p className="text-brand-muted text-lg leading-[1.6] tracking-[-0.45px]">
              복잡한 세팅 없이 우리 팀만의 협업 공간을 만들어 보세요.
            </p>
          </div>
          <div className="flex w-full flex-col gap-[15px] lg:w-[420px]">
            {templateItems.map((item) => {
              const isSelected = item.id === selectedId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={cn(
                    'flex items-center justify-between rounded-2xl border p-[21px] text-left transition-colors',
                    isSelected ? 'border-[#afb2ff] bg-[#f7f7ff]' : 'bg-white',
                  )}
                  style={isSelected ? undefined : { borderColor: item.borderColor }}
                >
                  <div className="flex items-center gap-[15px]">
                    <div
                      className="flex size-11 items-center justify-center rounded-[15px]"
                      style={{ background: item.gradient }}
                    >
                      <item.icon className="size-5 text-white" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-brand-ink text-lg font-bold tracking-[-0.45px]">
                        {item.title}
                      </span>
                      <span className="text-brand-muted text-[15px] leading-[1.6] tracking-[-0.375px]">
                        {item.shortDescription}
                      </span>
                    </div>
                  </div>
                  {isSelected && <ChevronRight className="text-brand size-[22px] shrink-0" />}
                </button>
              );
            })}
          </div>
        </motion.div>
        <motion.div variants={fadeUp} className="w-full min-w-0">
          <div className="flex h-[600px] w-full flex-col gap-[30px] rounded-2xl border border-[#f1f3f9] bg-[#fbfcfd] p-6 sm:p-[41px]">
            <div className="flex items-start gap-[15px]">
              <div
                className="flex size-[60px] shrink-0 items-center justify-center rounded-[20px]"
                style={{ background: selected.gradient }}
              >
                <selected.icon className="size-8 text-white" />
              </div>
              <div className="flex flex-col gap-[5px]">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-brand-ink text-[22px] leading-[1.4] font-bold tracking-[-0.55px]">
                    {selected.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selected.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full px-2 py-0.5 text-[13px] font-semibold tracking-[-0.325px]"
                        style={{ backgroundColor: selected.tagBg, color: selected.tagText }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-brand-muted leading-[1.6] tracking-[-0.4px]">
                  {selected.fullDescription}
                </p>
              </div>
            </div>
            <div className="flex min-h-0 flex-1 items-center justify-center rounded-2xl bg-[#f7f7f7] p-5">
              <p className="text-xl font-bold tracking-[-0.5px] text-[#939393]">
                템플릿 UI 스크린샷
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
