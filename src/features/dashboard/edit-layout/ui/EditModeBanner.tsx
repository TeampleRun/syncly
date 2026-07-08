// 편집 모드 안내 배너 — 편집 모드일 때 대시보드 상단에 노출
import { GripVertical } from 'lucide-react';

export default function EditModeBanner() {
  return (
    <div className="mb-4 flex items-center gap-3 rounded-2xl border border-[#c6d2ff] bg-[#eef2ff] px-4 py-3">
      <GripVertical className="size-4 shrink-0 text-[#615fff]" />
      <p className="text-sm text-[#432dd7]">
        <strong className="font-bold">편집 모드</strong> — 좌상단 ⠿ 이동 · 우하단 ↘ 크기 조절 ·
        우상단 🗑 삭제 · 아래 <strong className="font-bold">위젯 추가</strong> 버튼으로 카드 추가
      </p>
    </div>
  );
}
