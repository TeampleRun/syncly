// 대시보드 그리드 — react-grid-layout(v2)로 위젯 타일을 배치/드래그/리사이즈한다.
// 편집 모드에서는 카드별 편집 chrome(이동 핸들·크기 뱃지·삭제)과 인디고 테두리가 노출되고,
// 드래그는 좌상단 핸들(.rgl-drag-handle)로만 시작된다. 숨긴 위젯은 렌더에서 제외된다.
//
// 그리드는 컨테이너 실측 width와 localStorage에 의존하므로 SSR/hydration 시점에는
// 렌더하지 않고 클라이언트 마운트 이후에만 렌더한다(useSyncExternalStore로 SSR-안전하게 게이팅).
'use client';

import { useSyncExternalStore, type Ref } from 'react';
import ReactGridLayout, { useContainerWidth } from 'react-grid-layout';
import type { Layout, ResizeHandleAxis } from 'react-grid-layout';
import { Maximize2, GripVertical, Trash2 } from 'lucide-react';

import { getWidgetSize } from '@/shared/side-project/lib/widget-size';

import { DASHBOARD_WIDGETS } from '../config/widgets';

const emptySubscribe = () => () => {};
// 서버: false, 클라이언트 마운트 이후: true (hydration 렌더는 서버 스냅샷을 사용해 일치 보장)
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

// 우하단 리사이즈 핸들 커스텀(원형). react-resizable 기본 클래스로 위치를 잡고 배경 삼각형은 제거한다.
const renderResizeHandle = (axis: ResizeHandleAxis, ref: Ref<HTMLElement>) => (
  <div
    ref={ref as Ref<HTMLDivElement>}
    className={`react-resizable-handle react-resizable-handle-${axis} border-brand/10 text-brand-muted -right-2! -bottom-2! flex! size-6! items-center justify-center rounded-full! border bg-white! bg-none! p-0! shadow-md transition-opacity [&::after]:hidden!`}
  >
    <Maximize2 className="size-3.5" />
  </div>
);

interface DashboardGridProps {
  layout: Layout;
  editMode: boolean;
  hiddenIds: string[];
  onLayoutChange: (layout: Layout) => void;
  onRemove: (id: string) => void;
}

export default function DashboardGrid({
  layout,
  editMode,
  hiddenIds,
  onLayoutChange,
  onRemove,
}: DashboardGridProps) {
  const { width, containerRef } = useContainerWidth();
  const isClient = useIsClient();

  const activeWidgets = DASHBOARD_WIDGETS.filter((widget) => !hiddenIds.includes(widget.layout.i));
  const activeLayout = layout.filter((item) => !hiddenIds.includes(item.i));

  return (
    <div ref={containerRef} className="w-full">
      {isClient && width > 0 && (
        <ReactGridLayout
          // 보기 모드에서는 RGL이 남겨두는 리사이즈 핸들이 hover 시 노출되지 않도록 숨긴다.
          className={editMode ? undefined : '[&_.react-resizable-handle]:hidden!'}
          layout={activeLayout}
          width={width}
          onLayoutChange={onLayoutChange}
          gridConfig={{ cols: 12, rowHeight: 40, margin: [16, 16], containerPadding: [0, 0] }}
          dragConfig={{ enabled: editMode, handle: '.rgl-drag-handle' }}
          resizeConfig={{ enabled: editMode, handleComponent: renderResizeHandle }}
        >
          {activeWidgets.map((widget) => {
            const id = widget.layout.i;
            const item = activeLayout.find((entry) => entry.i === id) ?? widget.layout;
            const size = getWidgetSize(item.w, item.h);
            return (
              <div
                key={id}
                className={editMode ? 'group rounded-2xl ring-2 ring-[#a3b3ff]' : undefined}
              >
                {editMode && (
                  <>
                    {/* 좌상단 이동 핸들 */}
                    <div
                      className="rgl-drag-handle border-brand/10 text-brand-muted pointer-events-none absolute -top-2 -left-2 z-10 flex size-7 cursor-move items-center justify-center rounded-full border bg-white opacity-0 shadow-md transition-opacity group-hover:pointer-events-auto group-hover:opacity-100"
                      aria-label="이동"
                    >
                      <GripVertical className="size-4" />
                    </div>
                    {/* 상단 크기 뱃지 */}
                    <span className="bg-brand absolute -top-3 left-1/2 z-10 -translate-x-1/2 rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
                      {item.w}열×{item.h}행
                    </span>
                    {/* 우상단 삭제 */}
                    <button
                      type="button"
                      onClick={() => onRemove(id)}
                      className="pointer-events-none absolute -top-2 -right-2 z-10 flex size-7 items-center justify-center rounded-full border border-[#fecaca] bg-white text-[#fb2c36] opacity-0 shadow-md transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 hover:bg-[#fff1f2]"
                      aria-label="삭제"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </>
                )}
                {widget.render(size)}
              </div>
            );
          })}
        </ReactGridLayout>
      )}
    </div>
  );
}
