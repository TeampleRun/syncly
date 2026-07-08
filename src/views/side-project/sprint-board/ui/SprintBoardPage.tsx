// 스프린트 보드 페이지 셸 — 폰트/배경만 잡고 실제 보드는 feature(SprintBoard)가 담당한다.
// 순수 표시용 요약 헤더(Epic B)는 여기(뷰)에서 조립하고, 상호작용이 있는 보드/백로그는 feature에 둔다.
import { Plus_Jakarta_Sans } from 'next/font/google';

import { SprintBoard } from '@/features/sprint-board';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

export default function SprintBoardPage() {
  return (
    <div className={`${jakarta.className} bg-brand-surface min-h-full p-6`}>
      {/* TODO(Epic B): <SprintSummaryHeader /> */}
      <SprintBoard />
    </div>
  );
}
