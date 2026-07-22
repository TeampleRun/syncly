// 대시보드 레이아웃 편집 상태 훅 — 배치(layout) + 편집 모드를 관리하고 변경을 영속화한다.
// 화면에 배치된 위젯 = layout. 추가는 카탈로그 항목(LayoutItem)을 넣고, 삭제는 layout에서 뺀다.
// 초기 레이아웃은 서버(RSC)에서 조회해 initialLayout으로 주입받는다(마운트 후 재조회 없음).
// 저장(쓰기)만 서버액션으로 위임한다. 현재 DB 영속화 키는 (userId, workspaceId)이며 editMode는 저장하지 않는다.
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import type { Layout, LayoutItem } from 'react-grid-layout';

import { saveDashboardLayout } from '@/entities/dashboard-layout/api/save-dashboard-layout';
import { normalizeLayout } from '@/shared/dashboard/lib/normalize-layout';
import type { DashboardLayoutState } from '@/entities/dashboard-layout/model/dashboard-layout.types';

// 저장·상태로 남기는 값은 위치(i,x,y,w,h)만 — minW/minH 등 위젯 제약은 카탈로그가 소유하며
// 렌더 시점에 머지한다(DB에 위젯 설정이 중복 저장되지 않도록).
const toPosition = ({ i, x, y, w, h }: LayoutItem): LayoutItem => ({ i, x, y, w, h });

interface UseDashboardLayoutParams {
  /** 향후 페이지별 레이아웃 확장을 위한 구분값 — 현재 DB에는 저장하지 않는다 */
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
  const [layout, setLayout] = useState<Layout>(() => normalizeLayout(initialLayout.layout));
  const [editMode, setEditMode] = useState(false);
  const didMountRef = useRef(false);
  const saveQueueRef = useRef(Promise.resolve());

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    const timeoutId = window.setTimeout(() => {
      saveQueueRef.current = saveQueueRef.current
        .catch(() => undefined)
        .then(() => saveDashboardLayout(workspaceId, pageType, { layout }))
        .catch((error: unknown) => {
          console.error(error);
          toast.error('대시보드 레이아웃 저장에 실패했습니다.');
        });
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [layout, workspaceId, pageType]);

  const handleLayoutChange = useCallback((next: Layout) => {
    const positions = normalizeLayout(next.map(toPosition));
    setLayout(positions);
  }, []);

  const addWidget = useCallback(
    (item: LayoutItem) =>
      setLayout((prev) => {
        if (prev.some((entry) => entry.i === item.i)) return prev;
        return normalizeLayout([...prev, toPosition(item)]);
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
