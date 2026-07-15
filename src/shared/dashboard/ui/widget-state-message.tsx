// 위젯 상태 메시지 — 로딩/에러/빈 상태를 카드 안에 중앙 정렬로 보여준다.
// 여러 위젯이 동일한 상태 표시를 쓰므로 공용화한다(헤더는 위젯별로 다르니 prop으로 받는다).
import type { ReactNode } from 'react';
import { WidgetCard } from './widget-card';

interface WidgetStateMessageProps {
  /** 위젯별 헤더(제목/액션). 헤더가 필요 없는 위젯은 생략 가능 */
  header?: ReactNode;
  message: string;
}

export function WidgetStateMessage({ header, message }: WidgetStateMessageProps) {
  return (
    <WidgetCard>
      {header}
      <div className="text-brand-muted flex min-h-0 flex-1 items-center justify-center text-center text-sm">
        {message}
      </div>
    </WidgetCard>
  );
}
