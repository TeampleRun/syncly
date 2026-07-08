// 대시보드 위젯 크기 토큰 — 그리드 타일의 폭(w)·높이(h)로 sm/md/lg를 판정한다.
// 타일을 리사이즈하면 이 값이 바뀌어 위젯이 밀도가 다른 변형을 렌더한다.
// 템플릿(side-project/store-operation/team-project)에 무관한 대시보드 공용 유틸.
export type WidgetSize = 'sm' | 'md' | 'lg';

// 폭·높이 각각의 레벨을 구해 "더 작은 쪽"으로 변형을 정한다.
// → 넓지만 낮은 타일(예: w6·h3)이 lg로 잡혀 내용이 잘리는 문제를 방지한다.
export function getWidgetSize(w: number, h: number): WidgetSize {
  const wLevel = w <= 2 ? 0 : w <= 3 ? 1 : 2;
  const hLevel = h <= 2 ? 0 : h <= 4 ? 1 : 2;
  const level = Math.min(wLevel, hLevel);
  return level === 0 ? 'sm' : level === 1 ? 'md' : 'lg';
}
