// 대시보드 레이아웃 편집 상태 훅 — 배치(layout) + 편집 모드를 관리하고 변경을 영속화한다.
// 화면에 배치된 위젯 = layout. 추가는 카탈로그 항목(LayoutItem)을 넣고, 삭제는 layout에서 뺀다.
// 영속화 대상은 (workspaceId, pageType) 키로 식별한다. editMode는 순수 UI 상태라 저장하지 않는다.
import { useCallback, useEffect, useState } from 'react';
import type { Layout, LayoutItem } from 'react-grid-layout';

import { getDashboardLayout, saveDashboardLayout } from '@/entities/dashboard-layout';

// 저장·상태로 남기는 값은 위치(i,x,y,w,h)만 — minW/minH 등 위젯 제약은 카탈로그가 소유하며
// 렌더 시점에 머지한다(DB에 위젯 설정이 중복 저장되지 않도록).
const toPosition = ({ i, x, y, w, h }: LayoutItem): LayoutItem => ({ i, x, y, w, h });

interface UseDashboardLayoutParams {
  /** 영속화 키 — 어떤 워크스페이스의 어떤 페이지 레이아웃인지 */
  workspaceId: string;
  pageType: string;
}

export function useDashboardLayout({ workspaceId, pageType }: UseDashboardLayoutParams) {
  // 빈 상태로 시작 — 저장분이 있으면 마운트 후 조회해 채운다.
  const [layout, setLayout] = useState<Layout>([]);
  const [editMode, setEditMode] = useState(false);

  // TODO: DB 연동 — 마운트/키 변경 시 저장된 레이아웃을 조회해 복원 (React Query로 대체 가능)
  useEffect(() => {
    let active = true;
    getDashboardLayout(workspaceId, pageType).then((saved) => {
      if (active) setLayout(saved.layout);
    });
    return () => {
      active = false;
    };
  }, [workspaceId, pageType]);

  // TODO: DB 연동 — 변경 저장 (드래그 중 잦은 호출은 debounce 예정)
  const commit = useCallback(
    (next: Layout) => {
      void saveDashboardLayout(workspaceId, pageType, { layout: next });
    },
    [workspaceId, pageType],
  );

  const handleLayoutChange = useCallback(
    (next: Layout) => {
      const positions = next.map(toPosition);
      setLayout(positions);
      commit(positions);
    },
    [commit],
  );

  const addWidget = useCallback(
    (item: LayoutItem) =>
      setLayout((prev) => {
        if (prev.some((entry) => entry.i === item.i)) return prev;
        const next = [...prev, toPosition(item)];
        commit(next);
        return next;
      }),
    [commit],
  );

  const removeWidget = useCallback(
    (id: string) =>
      setLayout((prev) => {
        const next = prev.filter((entry) => entry.i !== id);
        commit(next);
        return next;
      }),
    [commit],
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
