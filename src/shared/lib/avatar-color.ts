// 사용자별 아바타 배경색 — seed(userId 권장) 해시로 결정론적 색을 고른다.
// 같은 사용자는 어느 화면에서든 항상 같은 색이 나오고, seed가 없으면(미배정 등) 중립 회색을 반환한다.
const AVATAR_PALETTE = [
  '#FE9A00',
  '#00C950',
  '#615FFF',
  '#2B7FFF',
  '#00B8DB',
  '#FF6B6B',
] as const;

// 담당자 미배정·미상일 때 사용하는 중립색
export const UNASSIGNED_AVATAR_COLOR = '#CBD5E1';

export function getAvatarColor(seed: string | null | undefined): string {
  if (!seed) {
    return UNASSIGNED_AVATAR_COLOR;
  }

  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}
