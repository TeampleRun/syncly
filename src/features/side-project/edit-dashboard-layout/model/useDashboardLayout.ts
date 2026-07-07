// 대시보드 레이아웃 편집 상태 훅 — 배치 + 편집 모드 + 숨긴 위젯(삭제/추가)을 관리하고
// localStorage에 저장해 새로고침에도 유지한다.
//
// 기본 레이아웃은 뷰가 소유(위젯 레지스트리에서 파생)하므로 인자로 주입받는다.
// → feature가 뷰에 의존하지 않아 레이어 방향(shared ← entities ← features ← widgets ← views)을 지킨다.
// DB 연동 시 localStorage 부분만 api 서버액션(React Query)으로 교체하면 된다.
import { useCallback, useState } from 'react';
import type { Layout } from 'react-grid-layout';

const STORAGE_KEY = 'syncly-dashboard-layout';

interface DashboardState {
  layout: Layout;
  hiddenIds: string[];
}

// 저장본에 없는 신규 위젯은 기본 배치로 채워 넣어, 위젯을 추가해도 유실되지 않게 한다.
function mergeMissing(layout: Layout, defaultLayout: Layout): Layout {
  const ids = new Set(layout.map((item) => item.i));
  const added = defaultLayout.filter((item) => !ids.has(item.i));
  return added.length ? [...layout, ...added] : layout;
}

function loadState(defaultLayout: Layout): DashboardState {
  if (typeof window === 'undefined') return { layout: defaultLayout, hiddenIds: [] };
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return { layout: defaultLayout, hiddenIds: [] };
    const parsed = JSON.parse(saved);
    // 구 포맷(레이아웃 배열) 호환
    if (Array.isArray(parsed)) {
      return { layout: mergeMissing(parsed as Layout, defaultLayout), hiddenIds: [] };
    }
    return {
      layout: mergeMissing((parsed.layout ?? defaultLayout) as Layout, defaultLayout),
      hiddenIds: (parsed.hiddenIds ?? []) as string[],
    };
  } catch {
    return { layout: defaultLayout, hiddenIds: [] };
  }
}

export function useDashboardLayout(defaultLayout: Layout) {
  const [state, setState] = useState<DashboardState>(() => loadState(defaultLayout));
  const [editMode, setEditMode] = useState(false);

  const update = useCallback((updater: (prev: DashboardState) => DashboardState) => {
    setState((prev) => {
      const next = updater(prev);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // 저장 실패 무시 (프라이빗 모드 등)
      }
      return next;
    });
  }, []);

  // 그리드는 활성 위젯만 넘기므로, 숨긴 위젯의 배치는 그대로 보존한다.
  const handleLayoutChange = useCallback(
    (activeLayout: Layout) =>
      update((prev) => {
        const hidden = new Set(prev.hiddenIds);
        const hiddenItems = prev.layout.filter((item) => hidden.has(item.i));
        return { ...prev, layout: [...activeLayout, ...hiddenItems] };
      }),
    [update],
  );

  const removeWidget = useCallback(
    (id: string) =>
      update((prev) =>
        prev.hiddenIds.includes(id) ? prev : { ...prev, hiddenIds: [...prev.hiddenIds, id] },
      ),
    [update],
  );

  const addWidget = useCallback(
    (id: string) =>
      update((prev) => ({ ...prev, hiddenIds: prev.hiddenIds.filter((x) => x !== id) })),
    [update],
  );

  const toggleEdit = useCallback(() => setEditMode((prev) => !prev), []);

  return {
    layout: state.layout,
    hiddenIds: state.hiddenIds,
    editMode,
    handleLayoutChange,
    removeWidget,
    addWidget,
    toggleEdit,
  };
}
