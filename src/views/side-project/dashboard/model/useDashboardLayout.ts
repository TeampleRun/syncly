// 대시보드 레이아웃 상태 훅 — react-grid-layout 배치 + 편집 모드를 관리하고
// 편집한 배치를 localStorage에 저장해 새로고침에도 유지한다. (zustand 등 외부 스토어 불필요)
import { useCallback, useState } from 'react';
import type { Layout } from 'react-grid-layout';

import { DEFAULT_LAYOUT } from '../config/widgets';

const STORAGE_KEY = 'syncly-dashboard-layout';

// 저장된 레이아웃을 읽어온다. SSR(window 없음)이나 파싱 실패 시 기본 레이아웃 사용.
// 그리드는 마운트 이후에만 렌더되므로(useContainerWidth) hydration 불일치가 발생하지 않는다.
function loadLayout(): Layout {
  if (typeof window === 'undefined') return DEFAULT_LAYOUT;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as Layout) : DEFAULT_LAYOUT;
  } catch {
    return DEFAULT_LAYOUT;
  }
}

export function useDashboardLayout() {
  const [layout, setLayout] = useState<Layout>(loadLayout);
  const [editMode, setEditMode] = useState(false);

  const handleLayoutChange = useCallback((next: Layout) => {
    setLayout(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // 저장 실패 무시 (프라이빗 모드 등)
    }
  }, []);

  const toggleEdit = useCallback(() => setEditMode((prev) => !prev), []);

  return { layout, editMode, handleLayoutChange, toggleEdit };
}
