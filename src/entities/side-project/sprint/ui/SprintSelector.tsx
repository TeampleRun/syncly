// 스프린트 선택기 — URL 파라미터(?sprint=id)로 전환한다.
// 클릭 = 네비게이션 → 라우트 RSC가 다시 실행되어 선택 스프린트로 재조회/재seed된다(클라 페칭 없음).
// 스프린트 보드/진행률 차트가 공유하는 순수 표현 컴포넌트라 entity 계층에 둔다.
import Link from 'next/link';

import { cn } from '@/shared/lib/utils';

import type { Sprint } from '../model/sprint.types';

interface SprintSelectorProps {
  sprints: Sprint[];
  currentSprintId: string;
}

export function SprintSelector({ sprints, currentSprintId }: SprintSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {sprints.map((sprint) => {
        const isActive = sprint.id === currentSprintId;
        return (
          <Link
            key={sprint.id}
            href={`?sprint=${sprint.id}`}
            scroll={false}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-semibold transition-colors',
              isActive
                ? 'bg-brand text-white'
                : 'border-brand/10 text-brand-muted hover:text-brand-ink border bg-white',
            )}
          >
            {sprint.name}
          </Link>
        );
      })}
    </div>
  );
}
