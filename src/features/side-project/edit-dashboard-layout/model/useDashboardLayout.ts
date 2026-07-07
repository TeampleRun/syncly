// 대시보드 레이아웃 편집 상태 훅 — 배치 + 편집 모드 + 숨긴 위젯(삭제/추가)을 관리한다.
// 영속화는 api 서버액션(DB 연동, 현재 TODO)에 위임한다. editMode는 순수 UI 상태라 저장하지 않는다.
//
// 기본 레이아웃은 뷰가 소유(위젯 레지스트리에서 파생)하므로 인자로 주입받는다.
// → feature가 뷰에 의존하지 않아 레이어 방향(shared ← entities ← features ← widgets ← views)을 지킨다.
import { useCallback, useEffect, useState } from 'react';
import type { Layout } from 'react-grid-layout';

import { getDashboardLayout, saveDashboardLayout } from '../api/layout';
import type { DashboardLayoutState } from './dashboard-layout';

// 저장본에 없는 신규 위젯은 기본 배치로 채워 넣어, 위젯을 추가해도 유실되지 않게 한다.
function mergeMissing(layout: Layout, defaultLayout: Layout): Layout {
  const ids = new Set(layout.map((item) => item.i));
  const added = defaultLayout.filter((item) => !ids.has(item.i));
  return added.length ? [...layout, ...added] : layout;
}

export function useDashboardLayout(defaultLayout: Layout) {
  const [state, setState] = useState<DashboardLayoutState>(() => ({
    layout: defaultLayout,
    hiddenIds: [],
  }));
  const [editMode, setEditMode] = useState(false);

  // TODO: DB 연동 — 마운트 시 저장된 레이아웃을 조회해 복원 (React Query로 대체 가능)
  useEffect(() => {
    let active = true;
    getDashboardLayout().then((saved) => {
      if (active && saved) {
        setState({
          layout: mergeMissing(saved.layout, defaultLayout),
          hiddenIds: saved.hiddenIds,
        });
      }
    });
    return () => {
      active = false;
    };
  }, [defaultLayout]);

  const update = useCallback((updater: (prev: DashboardLayoutState) => DashboardLayoutState) => {
    setState((prev) => {
      const next = updater(prev);
      // TODO: DB 연동 — 변경 저장 (드래그 중 잦은 호출은 debounce 예정)
      void saveDashboardLayout(next);
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
