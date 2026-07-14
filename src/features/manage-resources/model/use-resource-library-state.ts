'use client';

// 자료실의 서버 목록, 링크·파일 저장, signed URL 다운로드를 TanStack Query 상태로 관리합니다.
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createLinkResource,
  getResourceDownloadUrl,
  uploadFileResource,
} from '@/entities/resource/api/resource-actions';
import { getResourceLibrary } from '@/entities/resource/api/get-resource-library';
import { resourceLibraryQueryKey } from '@/entities/resource/model/resource-query';
import type {
  ResourceFormValues,
  ResourceItem,
  ResourceLibraryData,
  ResourceType,
} from '@/entities/resource';

interface UseResourceLibraryStateParams {
  initialData: ResourceLibraryData;
  workspaceId: string;
}

export function useResourceLibraryState({
  initialData,
  workspaceId,
}: UseResourceLibraryStateParams) {
  const notifiedQueryError = useRef<Error | null>(null);
  const {
    data = initialData,
    error,
    isError,
    isPending,
    isRefetchError,
    refetch,
  } = useQuery({
    queryKey: resourceLibraryQueryKey(workspaceId),
    queryFn: () => getResourceLibrary(workspaceId),
    initialData,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogResourceType, setDialogResourceType] = useState<ResourceType>('file');
  const createLinkMutation = useMutation({ mutationFn: createLinkResource });
  const uploadFileMutation = useMutation({ mutationFn: uploadFileResource });
  const downloadMutation = useMutation({ mutationFn: getResourceDownloadUrl });

  useEffect(() => {
    if (!error || (!isError && !isRefetchError)) {
      notifiedQueryError.current = null;
      return;
    }

    if (notifiedQueryError.current === error) return;

    notifiedQueryError.current = error;
    toast.error('자료 목록을 새로고침하지 못했습니다. 잠시 후 다시 시도해주세요.');
  }, [error, isError, isRefetchError]);

  const addResource = async (values: ResourceFormValues): Promise<boolean> => {
    const title = values.title.trim() || values.file?.name.trim() || values.url.trim();
    const description = values.description.trim();

    if (!title) return false;

    try {
      if (values.resourceType === 'file') {
        if (!values.file) return false;

        const formData = new FormData();
        formData.set('workspaceId', workspaceId);
        formData.set('file', values.file);
        formData.set('title', title);
        formData.set('description', description);
        const result = await uploadFileMutation.mutateAsync(formData);

        if (!result.ok) {
          toast.error(result.message);
          return false;
        }
      } else {
        const result = await createLinkMutation.mutateAsync({
          workspaceId,
          title,
          description,
          url: values.url.trim(),
        });

        if (!result.ok) {
          toast.error(result.message);
          return false;
        }
      }

      await refetch();
      setIsDialogOpen(false);
      return true;
    } catch {
      toast.error('자료 저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
      return false;
    }
  };

  const openFile = async (resource: ResourceItem): Promise<void> => {
    const downloadWindow = window.open('', '_blank');

    try {
      const result = await downloadMutation.mutateAsync({ workspaceId, resourceId: resource.id });

      if (!result.ok) {
        downloadWindow?.close();
        toast.error(result.message);
        return;
      }

      if (downloadWindow) {
        downloadWindow.opener = null;
        downloadWindow.location.href = result.data.url;
      } else {
        window.location.assign(result.data.url);
      }
    } catch {
      downloadWindow?.close();
      toast.error('파일 다운로드 링크를 만들지 못했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  return {
    resources: data.resources,
    isDialogOpen,
    dialogResourceType,
    isLoading: isPending,
    isSaving: createLinkMutation.isPending || uploadFileMutation.isPending,
    openDialog: (nextResourceType: ResourceType) => {
      setDialogResourceType(nextResourceType);
      setIsDialogOpen(true);
    },
    closeDialog: () => setIsDialogOpen(false),
    addResource,
    openFile,
  };
}
