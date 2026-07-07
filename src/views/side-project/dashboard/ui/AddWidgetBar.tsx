// 위젯 추가 바 — 편집 모드에서 그리드 아래 노출. 숨긴 위젯을 다시 추가한다.
'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

interface HiddenWidget {
  id: string;
  title: string;
}

interface AddWidgetBarProps {
  hidden: HiddenWidget[];
  onAdd: (id: string) => void;
}

export default function AddWidgetBar({ hidden, onAdd }: AddWidgetBarProps) {
  const [open, setOpen] = useState(false);
  const hasHidden = hidden.length > 0;

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => hasHidden && setOpen((prev) => !prev)}
        disabled={!hasHidden}
        aria-expanded={open}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#a3b3ff] px-4 py-3 text-sm font-semibold text-[#615fff] transition-colors hover:bg-[#eef2ff] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus className="size-4" />
        {hasHidden ? '위젯 추가' : '모든 위젯이 표시 중입니다'}
      </button>

      {open && hasHidden && (
        <div className="border-brand/10 mt-2 flex flex-wrap gap-2 rounded-2xl border bg-white p-3">
          {hidden.map((widget) => (
            <button
              key={widget.id}
              type="button"
              onClick={() => {
                onAdd(widget.id);
                setOpen(false);
              }}
              className="text-brand-ink hover:bg-brand-surface border-brand/10 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold"
            >
              <Plus className="size-3" />
              {widget.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
