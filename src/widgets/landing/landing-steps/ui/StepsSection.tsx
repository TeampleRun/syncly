'use client';

// 온보딩 3단계 소개 섹션 — 템플릿 선택, 자동 구성, 초대까지의 흐름을 스텝 카드로 보여준다
import { motion } from 'motion/react';
import Image from 'next/image';
import { Link2 } from 'lucide-react';
import { fadeUp, staggerContainer, VIEWPORT_ONCE } from '@/shared/lib/motion';
import { templateItems } from '@/widgets/landing/landing-templates';

interface StepHeading {
  step: string;
  titleLines: [string, string];
  description: string;
}

const STEP_HEADINGS: StepHeading[] = [
  {
    step: 'STEP 01',
    titleLines: ['목적에 맞는 템플릿을', '선택하세요'],
    description: '우리 팀의 목적에 맞는 템플릿을 선택해요',
  },
  {
    step: 'STEP 02',
    titleLines: ['필요한 기능이', '자동으로 구성됩니다'],
    description: '목적에 맞게 준비된 위젯을 자유롭게 배치해요',
  },
  {
    step: 'STEP 03',
    titleLines: ['이제 바로', '협업을 시작하세요'],
    description: '팀원만 초대하면 모든 준비가 완료됩니다!',
  },
];

function StepHeader({ heading }: { heading: StepHeading }) {
  return (
    <div className="flex flex-col gap-1.25">
      <div className="flex flex-col gap-3">
        <span className="text-brand text-base font-extrabold tracking-[-0.4px]">
          {heading.step}
        </span>
        <h3 className="text-brand-ink text-[28px] leading-[1.4] font-bold tracking-[-0.7px]">
          {heading.titleLines[0]}
          <br />
          {heading.titleLines[1]}
        </h3>
      </div>
      <p className="text-brand-muted leading-[1.6] tracking-[-0.4px]">{heading.description}</p>
    </div>
  );
}

export default function StepsSection() {
  return (
    <section className="bg-white px-6 py-20 sm:px-16 lg:py-30">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="mx-auto flex max-w-350 flex-col items-center gap-12.5"
      >
        <motion.div variants={fadeUp} className="flex flex-col gap-6.25 text-center">
          <h2 className="text-brand-ink text-3xl leading-[1.4] font-bold tracking-[-0.9px] sm:text-4xl">
            클릭 몇 번으로, 우리 팀에 딱 맞는
            <br />
            <span className="text-brand">협업 공간</span>이 완성돼요
          </h2>
          <p className="text-brand-muted text-lg leading-[1.6] tracking-[-0.45px]">
            복잡한 세팅 없이 우리 팀만의 협업 공간을 만들어 보세요.
          </p>
        </motion.div>
        <div className="flex w-full flex-col items-stretch gap-12 lg:flex-row lg:gap-0">
          <motion.div variants={fadeUp} className="flex flex-1 flex-col gap-7.5 lg:px-12.5">
            <StepHeader heading={STEP_HEADINGS[0]} />
            <div className="flex flex-col gap-3.75">
              {templateItems.map((item, index) => (
                <div
                  key={item.id}
                  className={
                    index === 0
                      ? 'flex items-center rounded-2xl border border-[#afb2ff] bg-[#f7f7ff] p-5.25 drop-shadow-[0px_0px_6px_rgba(137,127,255,0.25)]'
                      : 'flex items-center rounded-2xl border bg-white p-5.25'
                  }
                  style={index === 0 ? undefined : { borderColor: item.borderColor }}
                >
                  <div className="flex items-center gap-3.75">
                    <div
                      className="flex size-11 items-center justify-center rounded-[15px]"
                      style={{ background: item.gradient }}
                    >
                      <item.icon className="size-5 text-white" />
                    </div>
                    <div className="flex flex-col gap-1.25">
                      <span className="text-brand-ink text-base font-bold tracking-[-0.4px]">
                        {item.title}
                      </span>
                      <span className="text-brand-muted text-[13px] leading-4">
                        {item.stepDescription}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <div className="hidden border-l-2 border-dashed border-[#e4e2fb] lg:block" />
          <motion.div variants={fadeUp} className="flex flex-1 flex-col gap-7.5 lg:px-12.5">
            <StepHeader heading={STEP_HEADINGS[1]} />
            <div className="flex h-72.5 flex-col justify-center gap-3.75 rounded-2xl bg-white">
              <div className="h-12.5 w-full rounded-[10px] bg-[#f1f0fd]" />
              <div className="flex w-full items-start gap-3.75">
                <div className="h-21.5 flex-1 rounded-[10px] border-3 border-dashed border-[#c3c0ff]" />
                <div className="h-21.5 flex-1 rounded-[10px] bg-[#f1f0fd]" />
                <div className="h-21.5 flex-1 rounded-[10px] bg-[#f1f0fd]" />
              </div>
              <div className="flex w-full items-start gap-4.5">
                <div className="h-21.5 flex-1 rounded-[10px] bg-[#f1f0fd]" />
                <div className="h-21.5 flex-1 rounded-[10px] border-3 border-dashed border-[#c3c0ff]" />
              </div>
            </div>
          </motion.div>
          <div className="hidden border-l-2 border-dashed border-[#e4e2fb] lg:block" />
          <motion.div variants={fadeUp} className="flex flex-1 flex-col gap-7.5 lg:px-12.5">
            <StepHeader heading={STEP_HEADINGS[2]} />
            <div className="flex h-77.5 items-center justify-center">
              <div className="relative h-75.75 w-79.75">
                <div className="absolute top-8.25 left-6 flex items-center justify-center rounded-full border-3 border-dashed border-[#c3c0ff] p-15">
                  <div className="flex size-37.5 flex-col items-center justify-center gap-1.5 rounded-full bg-white drop-shadow-[0px_0px_12.5px_rgba(154,150,248,0.25)]">
                    <Link2 className="text-brand size-11.5" />
                    <span className="text-brand text-xl font-extrabold tracking-[-0.5px]">
                      초대하기
                    </span>
                  </div>
                </div>
                <Image
                  src="/landing/avatar-1.png"
                  alt="팀원 아바타"
                  width={65}
                  height={65}
                  className="absolute top-0 left-31.5 rounded-full"
                />
                <Image
                  src="/landing/avatar-2.png"
                  alt="팀원 아바타"
                  width={65}
                  height={65}
                  className="absolute top-46.75 left-64.25 rounded-full"
                />
                <Image
                  src="/landing/avatar-3.png"
                  alt="팀원 아바타"
                  width={65}
                  height={65}
                  className="absolute top-46.75 left-0 rounded-full"
                />
                <div className="bg-brand-soft absolute top-9 left-6.75 size-6 rounded-full" />
                <div className="bg-brand-end/40 absolute top-7.5 left-4 size-2.75 rounded-full" />
                <div className="bg-brand-soft absolute top-70 left-0 size-2.75 rounded-full" />
                <div className="bg-brand-end/40 absolute top-14.75 left-73 size-2.75 rounded-full" />
                <div className="bg-brand/30 absolute top-13.75 left-76 size-1.25 rounded-full" />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
