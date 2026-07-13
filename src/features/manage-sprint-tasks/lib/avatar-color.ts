// 담당자 아바타 배경색 — Task 모델에는 색상 필드가 없어, 표시명 기반으로 결정론적 색을 고른다.
// 같은 담당자는 항상 같은 색이 나오도록 간단한 해시로 팔레트를 선택한다.
const AVATAR_PALETTE = [
  '#00C950',
  '#FE9A00',
  '#615FFF',
  '#00B8DB',
  '#2B7FFF',
  '#F6339A',
  '#7E22CE',
];

export function getAvatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}
