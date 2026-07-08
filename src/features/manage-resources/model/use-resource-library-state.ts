'use client';

// 자료실 목록과 파일/링크 추가 모달의 클라이언트 목업 상태를 관리합니다.
import { useMemo, useState } from 'react';
import type { ResourceFormValues, ResourceItem, ResourceType } from '@/entities/resource';

interface UseResourceLibraryStateParams {
  initialResources: ResourceItem[];
  workspaceId: string;
  uploaderName: string;
}

function sortResources(resources: ResourceItem[]) {
  return [...resources].sort((first, second) => second.createdAt.localeCompare(first.createdAt));
}

function createResourceId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `resource-${crypto.randomUUID()}`;
  }

  return `resource-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function createTodayLabel() {
  return new Date().toISOString().slice(0, 10);
}

export function useResourceLibraryState({
  initialResources,
  workspaceId,
  uploaderName,
}: UseResourceLibraryStateParams) {
  const workspaceResources = useMemo(
    () => sortResources(initialResources.filter((resource) => resource.workspaceId === workspaceId)),
    [initialResources, workspaceId],
  );
  const [resources, setResources] = useState(workspaceResources);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogResourceType, setDialogResourceType] = useState<ResourceType>('file');

  const addResource = (values: ResourceFormValues) => {
    const title = values.title.trim() || values.fileName.trim() || values.url.trim();
    const description = values.description.trim();

    if (!title) {
      return;
    }

    if (values.resourceType === 'link' && !values.url.trim()) {
      return;
    }

    const nextResource: ResourceItem = {
      id: createResourceId(),
      workspaceId,
      title,
      description,
      resourceType: values.resourceType,
      linkProvider: values.resourceType === 'link' ? values.linkProvider : undefined,
      url: values.resourceType === 'link' ? values.url.trim() : undefined,
      fileName: values.resourceType === 'file' ? values.fileName.trim() : undefined,
      uploadedBy: uploaderName,
      createdAt: createTodayLabel(),
    };

    setResources((currentResources) => sortResources([nextResource, ...currentResources]));
    setIsDialogOpen(false);
  };

  return {
    resources,
    isDialogOpen,
    dialogResourceType,
    openDialog: (nextResourceType: ResourceType) => {
      setDialogResourceType(nextResourceType);
      setIsDialogOpen(true);
    },
    closeDialog: () => setIsDialogOpen(false),
    addResource,
  };
}
