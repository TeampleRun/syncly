import type { WorkspacePurpose } from '@/shared/dashboard/model/template.types';

import { WIDGET_CATALOG, type WidgetId } from './widget-catalog';

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
 * 저장된 레이아웃은 사용자별로 달라질 수 있지만, 기본 카탈로그 좌표는 템플릿 내부에서 충돌하면 안 된다.
 */
export function validateTemplateWidgetLayouts(
  templateWidgets: Record<WorkspacePurpose, WidgetId[]>,
) {
  Object.entries(templateWidgets).forEach(([purpose, widgetIds]) => {
    widgetIds.forEach((widgetId, index) => {
      const currentLayout = WIDGET_CATALOG[widgetId].layout;

      widgetIds.slice(index + 1).forEach((otherWidgetId) => {
        const otherLayout = WIDGET_CATALOG[otherWidgetId].layout;

        if (isOverlapping(currentLayout, otherLayout)) {
          throw new Error(
            `기본 위젯 배치가 겹칩니다: ${purpose} template - ${widgetId} / ${otherWidgetId}`,
          );
        }
      });
    });
  });
}
