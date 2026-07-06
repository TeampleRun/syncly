// 랜딩 페이지 — 랜딩 위젯(헤더, 히어로, 템플릿, 기능, 스텝, CTA)을 조립하는 페이지 컴포넌트
import { Plus_Jakarta_Sans } from 'next/font/google';
import { CtaSection, LandingFooter } from '@/widgets/landing/landing-cta';
import { FeaturesSection } from '@/widgets/landing/landing-features';
import { LandingHeader } from '@/widgets/landing/landing-header';
import { HeroSection } from '@/widgets/landing/landing-hero';
import { StepsSection } from '@/widgets/landing/landing-steps';
import { TemplatesSection } from '@/widgets/landing/landing-templates';

// Figma 랜딩 디자인 지정 폰트 — 한글은 시스템 폰트로 fallback된다
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
});

export default function LandingPage() {
  return (
    <div className={`${jakarta.className} min-h-screen bg-white`}>
      <LandingHeader />
      <main>
        <HeroSection />
        <TemplatesSection />
        <FeaturesSection />
        <StepsSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
