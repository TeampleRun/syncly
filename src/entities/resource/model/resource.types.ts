// 자료실에서 파일과 외부 링크를 같은 목록으로 다루기 위한 타입입니다.
export type ResourceType = 'file' | 'link';

export type ResourceLinkProvider = 'link' | 'notion' | 'figma' | 'github';

export interface ResourceItem {
  id: string;
  workspaceId: string;
  uploadedById?: string | null;
  title: string;
  description: string;
  resourceType: ResourceType;
  linkProvider?: ResourceLinkProvider;
  url?: string;
  storagePath?: string;
  fileName?: string;
  uploadedBy: string;
  createdAt: string;
}

export interface ResourceFormValues {
  resourceType: ResourceType;
  title: string;
  description: string;
  url: string;
  file: File | null;
  linkProvider: ResourceLinkProvider;
}

export interface ResourceLibraryData {
  resources: ResourceItem[];
  viewer: ResourceViewer | null;
}

// 자료 수정·삭제 메뉴를 현재 로그인한 사용자의 업로드 권한에 맞춰 노출한다.
export interface ResourceViewer {
  userId: string;
  role: 'owner' | 'member';
}
