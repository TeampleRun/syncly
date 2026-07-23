// 설정 페이지의 탭 정의와 URL 쿼리(?tab=) 파싱 헬퍼입니다.
export type SettingsTabKey = 'workspace' | 'members' | 'profile';

export interface SettingsTab {
  key: SettingsTabKey;
  label: string;
}

export const SETTINGS_TABS: SettingsTab[] = [
  { key: 'workspace', label: '워크스페이스 관리' },
  { key: 'members', label: '팀 관리' },
  { key: 'profile', label: '프로필 설정' },
];

export const DEFAULT_SETTINGS_TAB: SettingsTabKey = 'workspace';

// URL 쿼리 값이 유효한 탭 키가 아니면 기본 탭으로 보정합니다.
export function parseSettingsTab(value: string | null | undefined): SettingsTabKey {
  return SETTINGS_TABS.some((tab) => tab.key === value)
    ? (value as SettingsTabKey)
    : DEFAULT_SETTINGS_TAB;
}
