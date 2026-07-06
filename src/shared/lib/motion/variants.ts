// Motion 공용 애니메이션 상수 — 랜딩 등에서 재사용하는 variants와 트랜지션 값을 중앙 관리한다
import type { Variants } from 'motion/react';

// 부드러운 감속 곡선 (easeOutQuint 계열) — 등장 애니메이션 공통 이징
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

// 등장 애니메이션 기본 지속 시간(초)
export const DURATION_BASE = 0.6;

// 스태거 등장 시 자식 간 시차(초)
export const STAGGER_CHILDREN = 0.12;

// 스크롤 리빌 공통 뷰포트 옵션 — 한 번만 재생, 요소가 80px 들어왔을 때 시작
export const VIEWPORT_ONCE = { once: true, margin: '-80px' } as const;

// 아래에서 위로 떠오르며 나타나는 기본 등장 효과
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION_BASE, ease: EASE_OUT },
  },
};

// 자식들을 순차 등장시키는 컨테이너 — 자식에 fadeUp 등을 걸어 사용
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER_CHILDREN } },
};

// 카드 호버 시 살짝 떠오르는 효과 — whileHover에 전달
export const hoverLift = {
  y: -6,
  transition: { duration: 0.25, ease: EASE_OUT },
} as const;
