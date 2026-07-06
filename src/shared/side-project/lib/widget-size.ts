// 대시보드 위젯 크기 토큰 — 그리드 타일의 폭(w)·높이(h)로 sm/md/lg를 판정한다.
// 타일을 리사이즈하면 이 값이 바뀌어 위젯이 밀도가 다른 변형을 렌더한다.
export type WidgetSize = 'sm' | 'md' | 'lg';

export function getWidgetSize(w: number, h: number): WidgetSize {
  // 폭이 좁거나 높이가 낮으면 리스트를 담을 수 없으므로 sm(요약)
  if (w <= 3 || h <= 2) return 'sm';
  if (w <= 5) return 'md';
  return 'lg';
}
