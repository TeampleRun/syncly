// 자료실에서 파일과 외부 링크를 같은 목록으로 다루기 위한 타입입니다.
export type ResourceType = 'file' | 'link';

// 링크 자료에서 선택할 수 있는 제공자 값의 단일 기준입니다.
export const RESOURCE_LINK_PROVIDERS = ['notion', 'figma', 'link', 'github'] as const;

export type ResourceLinkProvider = (typeof RESOURCE_LINK_PROVIDERS)[number];

// 링크 제공자 값을 화면 문구로 변환할 때 사용하는 단일 라벨 맵입니다.
export const RESOURCE_LINK_PROVIDER_LABEL: Record<ResourceLinkProvider, string> = {
  notion: '노션',
  figma: '피그마',
  link: '기타',
  github: '깃허브',
};

export function isResourceLinkProvider(value: string): value is ResourceLinkProvider {
  return RESOURCE_LINK_PROVIDERS.includes(value as ResourceLinkProvider);
}

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
