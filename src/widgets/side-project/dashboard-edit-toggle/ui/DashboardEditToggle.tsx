// 레이아웃 편집 토글 — 우하단 플로팅 버튼. 상태는 갖지 않고 props로만 제어되는 순수 위젯.
import { Check, Pencil } from 'lucide-react';

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
      className="text-brand-ink hover:bg-brand-surface fixed right-6 bottom-6 z-20 flex items-center gap-2 rounded-2xl border border-brand/10 bg-white px-4 py-2.5 text-sm font-semibold shadow-lg transition-colors"
    >
      {editing ? <Check className="text-brand size-4" /> : <Pencil className="size-4" />}
      {editing ? '편집 완료' : '레이아웃 편집'}
    </button>
  );
}
