// 대시보드 레이아웃 편집 상태 훅 — 배치(layout) + 편집 모드를 관리하고 변경을 영속화한다.
// 화면에 배치된 위젯 = layout. 추가는 카탈로그 항목(LayoutItem)을 넣고, 삭제는 layout에서 뺀다.
// 초기 레이아웃은 서버(RSC)에서 조회해 initialLayout으로 주입받는다(마운트 후 재조회 없음).
// 저장(쓰기)만 서버액션으로 위임한다. 영속화 키는 (workspaceId, pageType). editMode는 저장하지 않는다.
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Layout, LayoutItem } from 'react-grid-layout';

import { saveDashboardLayout, type DashboardLayoutState } from '@/entities/dashboard-layout';

// 저장·상태로 남기는 값은 위치(i,x,y,w,h)만 — minW/minH 등 위젯 제약은 카탈로그가 소유하며
// 렌더 시점에 머지한다(DB에 위젯 설정이 중복 저장되지 않도록).
const toPosition = ({ i, x, y, w, h }: LayoutItem): LayoutItem => ({ i, x, y, w, h });

interface UseDashboardLayoutParams {
  /** 영속화 키 — 어떤 워크스페이스의 어떤 페이지 레이아웃인지 */
  workspaceId: string;
  pageType: string;
  /** 서버(RSC)에서 조회한 초기 레이아웃 */
  initialLayout: DashboardLayoutState;
}

export function useDashboardLayout({
  workspaceId,
  pageType,
  initialLayout,
}: UseDashboardLayoutParams) {
  const [layout, setLayout] = useState<Layout>(initialLayout.layout);
  const [editMode, setEditMode] = useState(false);
  const didMountRef = useRef(false);

  // TODO: DB 연동 — 변경 저장 (드래그 중 잦은 호출은 debounce 예정)
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    void saveDashboardLayout(workspaceId, pageType, { layout });
  }, [layout, workspaceId, pageType]);

  const handleLayoutChange = useCallback(
    (next: Layout) => {
      const positions = next.map(toPosition);
      setLayout(positions);
    },
    [],
  );

  const addWidget = useCallback(
    (item: LayoutItem) =>
      setLayout((prev) => {
        if (prev.some((entry) => entry.i === item.i)) return prev;
        return [...prev, toPosition(item)];
      }),
    [],
  );

  const removeWidget = useCallback(
    (id: string) =>
      setLayout((prev) => {
        return prev.filter((entry) => entry.i !== id);
      }),
    [],
  );

  const toggleEdit = useCallback(() => setEditMode((prev) => !prev), []);

  return {
    layout,
    editMode,
    handleLayoutChange,
    addWidget,
    removeWidget,
    toggleEdit,
  };
}
