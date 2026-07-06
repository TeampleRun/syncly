// 대시보드 위젯 공통 셸 — 흰 카드 컨테이너 + 헤더(제목/액션) 구성 요소
import * as React from 'react';

import { cn } from '@/shared/lib/utils';

function WidgetCard({ className, children, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-2xl border border-brand/10 bg-white p-5',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function WidgetCardHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-brand-ink text-sm font-bold">{title}</h3>
      {action}
    </div>
  );
}

function WidgetCardAction({ className, ...props }: React.ComponentProps<'button'>) {
  return (
    <button
      type="button"
      className={cn('text-brand text-xs font-semibold', className)}
      {...props}
    />
  );
}

export { WidgetCard, WidgetCardHeader, WidgetCardAction };
