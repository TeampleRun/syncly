// 자료실에서 파일과 외부 링크를 같은 목록으로 다루기 위한 타입입니다.
export type ResourceType = 'file' | 'link';

export type ResourceLinkProvider = 'link' | 'notion' | 'figma' | 'github';

export interface ResourceItem {
  id: string;
  workspaceId: string;
  title: string;
  description: string;
  resourceType: ResourceType;
  linkProvider?: ResourceLinkProvider;
  url?: string;
  fileName?: string;
  uploadedBy: string;
  createdAt: string;
}

export interface ResourceFormValues {
  resourceType: ResourceType;
  title: string;
  description: string;
  url: string;
  fileName: string;
  linkProvider: ResourceLinkProvider;
}
