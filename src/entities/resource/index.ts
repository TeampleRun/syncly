// 자료실 도메인의 타입과 목업 데이터 공개 API입니다.
export type {
  ResourceFormValues,
  ResourceItem,
  ResourceLibraryData,
  ResourceLinkProvider,
  ResourceType,
  ResourceViewer,
} from './model/resource.types';
export {
  isResourceLinkProvider,
  RESOURCE_LINK_PROVIDER_LABEL,
  RESOURCE_LINK_PROVIDERS,
} from './model/resource.types';
export { mockResources } from './model/mock-resources';
export { getResourceLibrary } from './api/get-resource-library';
export { resourceLibraryQueryKey } from './model/resource-query';
