// 레이아웃 편집 토글 — 우하단 플로팅 버튼. 상태는 갖지 않고 props로만 제어되는 순수 컴포넌트.
//  · 보기 모드: 흰 버튼 "레이아웃 편집"
//  · 편집 모드: 인디고 채움 버튼 "편집 완료"
import { Check, Pencil } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

interface DashboardEditToggleProps {
  editing: boolean;
  onToggle: () => void;
}

export default function DashboardEditToggle({ editing, onToggle }: DashboardEditToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={editing}
      className={cn(
        'fixed right-6 bottom-6 z-20 flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold shadow-lg transition-colors',
        editing
          ? 'bg-[#4f39f6] text-white hover:bg-[#4530d9]'
          : 'text-brand-ink hover:bg-brand-surface border border-brand/10 bg-white',
      )}
    >
      {editing ? <Check className="size-4" /> : <Pencil className="size-4" />}
      {editing ? '편집 완료' : '레이아웃 편집'}
    </button>
  );
}
