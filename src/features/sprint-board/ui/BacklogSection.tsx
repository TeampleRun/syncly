'use client';

// 백로그 섹션 — 접기/펼치기 가능한 패널. 헤더(아이콘 + 제목 + 개수 배지)와 항목 목록, 추가 버튼으로 구성.
// 펼침 여부는 로컬 상태로 관리한다(상호작용). 항목 추가 동작은 Epic E에서 연결한다.
import { useState } from 'react';

import { ChevronDown, Package, Plus } from 'lucide-react';

import type { Task } from '@/entities/side-project/task';

import { BacklogRow } from './BacklogRow';

export function BacklogSection({ tasks }: { tasks: Task[] }) {
  const [open, setOpen] = useState(true);

  return (
    <section className="border-brand/10 rounded-2xl border bg-white">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between p-4"
      >
        <span className="flex items-center gap-2">
          <Package className="text-brand-muted size-4" aria-hidden="true" />
          <span className="text-brand-ink text-sm font-bold">백로그</span>
          <span className="bg-brand-surface text-brand-muted rounded-full px-2 py-0.5 text-xs font-semibold">
            {tasks.length}개
          </span>
        </span>
        <ChevronDown
          className={`text-brand-muted size-4 transition-transform ${open ? '' : '-rotate-90'}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="border-brand/10 border-t px-4 pb-4">
          <div className="divide-brand/10 divide-y">
            {tasks.map((task) => (
              <BacklogRow key={task.id} task={task} />
            ))}
          </div>

          {/* TODO(Epic E): 백로그 항목 추가 동작 연결 */}
          <button
            type="button"
            className="text-brand mt-3 flex items-center gap-1 text-sm font-semibold"
          >
            <Plus className="size-4" aria-hidden="true" />
            백로그 항목 추가
          </button>
        </div>
      )}
    </section>
  );
}
