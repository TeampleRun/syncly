// 위젯 추가 바 — 편집 모드에서 그리드 아래 노출. 아직 배치되지 않은 위젯을 카탈로그에서 추가한다.
'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

interface AvailableWidget {
  id: string;
  title: string;
}

interface AddWidgetBarProps {
  available: AvailableWidget[];
  onAdd: (id: string) => void;
}

export default function AddWidgetBar({ available, onAdd }: AddWidgetBarProps) {
  const [open, setOpen] = useState(false);
  const hasAvailable = available.length > 0;

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => hasAvailable && setOpen((prev) => !prev)}
        disabled={!hasAvailable}
        aria-expanded={open}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#a3b3ff] px-4 py-3 text-sm font-semibold text-[#615fff] transition-colors hover:bg-[#eef2ff] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus className="size-4" />
        {hasAvailable ? '위젯 추가' : '모든 위젯이 표시 중입니다'}
      </button>

      {open && hasAvailable && (
        <div className="border-brand/10 mt-2 flex flex-wrap gap-2 rounded-2xl border bg-white p-3">
          {available.map((widget) => (
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
