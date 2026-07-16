// 워크스페이스 통합 검색 결과를 모든 검색 원본에서 동일하게 표현합니다.
export type WorkspaceSearchType =
  'announcement' | 'resource' | 'task' | 'chat' | 'meetingNote' | 'calendarEvent';

export interface WorkspaceSearchResult {
  id: string;
  type: WorkspaceSearchType;
  title: string;
  description: string | null;
  href: string;
}
