import type { Layout, LayoutItem } from 'react-grid-layout';

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

type LayoutConstraintMap = Partial<Record<string, Partial<LayoutItem>>>;

function getBoundedSize(
  value: number,
  minValue: number | undefined,
  maxValue: number | undefined,
  fallbackMin = 1,
) {
  const lowerBound = Math.max(fallbackMin, minValue ?? fallbackMin);
  const upperBound = Math.max(lowerBound, maxValue ?? value);

  return Math.min(Math.max(value, lowerBound), upperBound);
}

function clampLayoutItem(
  item: LayoutItem,
  cols: number,
  constraints?: Partial<LayoutItem>,
): LayoutItem {
  const width = getBoundedSize(item.w, constraints?.minW, Math.min(constraints?.maxW ?? cols, cols));
  const height = getBoundedSize(item.h, constraints?.minH, constraints?.maxH);
  const x = Math.max(0, Math.min(item.x, cols - width));
  const y = Math.max(0, item.y);

  return { ...constraints, ...item, x, y, w: width, h: height };
}

export function areLayoutsEqual(left: Layout, right: Layout) {
  return (
    left.length === right.length &&
    left.every((item, index) => {
      const other = right[index];
      return (
        item.i === other?.i &&
        item.x === other.x &&
        item.y === other.y &&
        item.w === other.w &&
        item.h === other.h
      );
    })
  );
}

/**
 * 저장된 레이아웃이 오래된 기본값/위젯 크기 변경과 충돌해도
 * 렌더 시점에 서로 겹치지 않도록 y축으로 밀어내며 정규화한다.
 */
export function normalizeLayout(layout: Layout, cols = 12, constraintsById: LayoutConstraintMap = {}): Layout {
  const working = layout
    .map((item, index) => ({
      ...clampLayoutItem(item, cols, constraintsById[item.i]),
      _index: index,
    }))
    .sort((left, right) => left.y - right.y || left.x - right.x || left._index - right._index);

  const placed: Array<LayoutItem & { _index: number }> = [];

  working.forEach((item) => {
    const nextItem = { ...item };

    while (true) {
      const overlapping = placed.filter((placedItem) => isOverlapping(nextItem, placedItem));

      if (overlapping.length === 0) break;

      nextItem.y = Math.max(...overlapping.map((placedItem) => placedItem.y + placedItem.h));
    }

    placed.push(nextItem);
  });

  return placed
    .sort((left, right) => left._index - right._index)
    .map((item) => {
      const { _index: removedIndex, ...normalizedItem } = item;
      void removedIndex;
      return normalizedItem;
    });
}
