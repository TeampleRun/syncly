// 대시보드 그리드 — react-grid-layout(v2)로 위젯 타일을 배치/드래그/리사이즈한다.
// 편집 모드일 때만 드래그·리사이즈가 활성화된다.
//
// 그리드는 컨테이너 실측 width와 localStorage에 의존하므로 SSR/hydration 시점에는
// 렌더하지 않고 클라이언트 마운트 이후에만 렌더한다(useSyncExternalStore로 SSR-안전하게 게이팅).
// 이렇게 하면 서버/클라이언트 HTML이 어긋나는 hydration mismatch가 발생하지 않는다.
'use client';

import { useSyncExternalStore } from 'react';
import ReactGridLayout, { useContainerWidth } from 'react-grid-layout';
import type { Layout } from 'react-grid-layout';

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

interface DashboardGridProps {
  layout: Layout;
  editMode: boolean;
  onLayoutChange: (layout: Layout) => void;
}

export default function DashboardGrid({ layout, editMode, onLayoutChange }: DashboardGridProps) {
  const { width, containerRef } = useContainerWidth();
  const isClient = useIsClient();

  return (
    <div ref={containerRef} className="w-full">
      {isClient && width > 0 && (
        <ReactGridLayout
          layout={layout}
          width={width}
          onLayoutChange={onLayoutChange}
          gridConfig={{ cols: 12, rowHeight: 40, margin: [16, 16], containerPadding: [0, 0] }}
          dragConfig={{ enabled: editMode }}
          resizeConfig={{ enabled: editMode }}
        >
          {DASHBOARD_WIDGETS.map((widget) => (
            <div key={widget.layout.i} className={editMode ? 'cursor-move' : undefined}>
              {widget.render()}
            </div>
          ))}
        </ReactGridLayout>
      )}
    </div>
  );
}
