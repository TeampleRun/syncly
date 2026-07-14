import type { LayoutItem } from 'react-grid-layout';

import type { WorkspacePurpose } from '@/shared/dashboard/model/template.types';

import type { WidgetId } from './widget-catalog';

interface LayoutRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

function isOverlapping(left: LayoutRect, right: LayoutRect) {
  return (
    left.x < right.x + right.w &&
    left.x + left.w > right.x &&
    left.y < right.y + right.h &&
    left.y + left.h > right.y
  );
}

/**
 * 템플릿별 "기본 추가 배치"가 겹치지 않는지 개발 시점에 바로 검증한다.
 * 저장된 레이아웃은 사용자별로 달라질 수 있지만, 같은 템플릿에서 함께 추가 가능한
 * 기본 좌표는 서로 충돌하면 안 된다.
 */
export function validateTemplateWidgetLayouts(
  templateWidgetLayouts: Record<WorkspacePurpose, Partial<Record<WidgetId, LayoutItem>>>,
) {
  Object.entries(templateWidgetLayouts).forEach(([purpose, layouts]) => {
    const widgetIds = Object.keys(layouts) as WidgetId[];

    widgetIds.forEach((widgetId, index) => {
      const currentLayout = layouts[widgetId];

      if (!currentLayout) return;

      widgetIds.slice(index + 1).forEach((otherWidgetId) => {
        const otherLayout = layouts[otherWidgetId];

        if (!otherLayout) return;

        if (isOverlapping(currentLayout, otherLayout)) {
          throw new Error(
            `기본 위젯 배치가 겹칩니다: ${purpose} template - ${widgetId} / ${otherWidgetId}`,
          );
        }
      });
    });
  });
}
