// 대시보드 레이아웃 편집 상태 훅 — react-grid-layout 배치 + 편집 모드를 관리하고
// 편집한 배치를 localStorage에 저장해 새로고침에도 유지한다.
//
// 기본 레이아웃은 뷰가 소유(위젯 레지스트리에서 파생)하므로 인자로 주입받는다.
// → feature가 뷰에 의존하지 않아 레이어 방향(shared ← entities ← features ← widgets ← views)을 지킨다.
// DB 연동 시 localStorage 부분만 api/changeLayout 서버액션(React Query)으로 교체하면 된다.
import { useCallback, useState } from 'react';
import type { Layout } from 'react-grid-layout';

const STORAGE_KEY = 'syncly-dashboard-layout';

// 저장된 레이아웃을 읽어온다. SSR(window 없음)이나 파싱 실패 시 기본 레이아웃 사용.
function loadLayout(defaultLayout: Layout): Layout {
  if (typeof window === 'undefined') return defaultLayout;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as Layout) : defaultLayout;
  } catch {
    return defaultLayout;
  }
}

export function useDashboardLayout(defaultLayout: Layout) {
  const [layout, setLayout] = useState<Layout>(() => loadLayout(defaultLayout));
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
