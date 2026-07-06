// 대시보드 그리드 — react-grid-layout(v2)로 위젯 타일을 배치/드래그/리사이즈한다.
// 편집 모드일 때만 드래그·리사이즈가 활성화된다. 각 타일의 현재 크기(w/h)로
// sm/md/lg를 판정해 위젯에 전달하므로, 리사이즈하면 위젯 내용 밀도가 바뀐다.
//
// 그리드는 컨테이너 실측 width와 localStorage에 의존하므로 SSR/hydration 시점에는
// 렌더하지 않고 클라이언트 마운트 이후에만 렌더한다(useSyncExternalStore로 SSR-안전하게 게이팅).
'use client';

import { useSyncExternalStore } from 'react';
import ReactGridLayout, { useContainerWidth } from 'react-grid-layout';
import type { Layout } from 'react-grid-layout';

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
          {DASHBOARD_WIDGETS.map((widget) => {
            // 현재 레이아웃에서 이 위젯의 실제 크기를 찾아 sm/md/lg 판정
            const item = layout.find((entry) => entry.i === widget.layout.i) ?? widget.layout;
            const size = getWidgetSize(item.w, item.h);
            return (
              <div key={widget.layout.i} className={editMode ? 'cursor-move' : undefined}>
                {widget.render(size)}
              </div>
            );
          })}
        </ReactGridLayout>
      )}
    </div>
  );
}
