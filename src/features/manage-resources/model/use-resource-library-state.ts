'use client';

// 자료실의 서버 목록, 링크·파일 저장, signed URL 다운로드를 TanStack Query 상태로 관리합니다.
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createLinkResource,
  createFileResource,
  deleteResource,
  getResourceDownloadUrl,
  updateResource,
} from '@/entities/resource/api/resource-actions';
import { getResourceLibrary } from '@/entities/resource/api/get-resource-library';
import { resourceLibraryQueryKey } from '@/entities/resource/model/resource-query';
import type {
  ResourceFormValues,
  ResourceItem,
  ResourceLibraryData,
  ResourceType,
} from '@/entities/resource';
import { getSupabaseBrowserClient } from '@/shared/api/supabase/client';

const RESOURCE_STORAGE_BUCKET = 'workspace-resources';

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
  const [editingResourceId, setEditingResourceId] = useState<string | null>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const createLinkMutation = useMutation({ mutationFn: createLinkResource });
  const createFileMutation = useMutation({ mutationFn: createFileResource });
  const downloadMutation = useMutation({ mutationFn: getResourceDownloadUrl });
  const updateMutation = useMutation({ mutationFn: updateResource });
  const deleteMutation = useMutation({ mutationFn: deleteResource });

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

        setIsUploadingFile(true);
        // Storage 객체 키는 한글·공백 파일명 대신 UUID와 안전한 확장자만 사용한다.
        const storagePath = `${workspaceId}/${crypto.randomUUID()}${getFileExtension(
          values.file.name,
        )}`;
        const supabase = getSupabaseBrowserClient();
        const { error: uploadError } = await supabase.storage
          .from(RESOURCE_STORAGE_BUCKET)
          .upload(storagePath, values.file, {
            contentType: values.file.type || undefined,
            upsert: false,
          });

        if (uploadError) {
          console.error('[resource] Storage 파일 업로드 실패:', uploadError);
          toast.error('파일 업로드에 실패했습니다. 파일 용량과 저장소 권한을 확인해주세요.');
          return false;
        }

        const result = await createFileMutation.mutateAsync({
          workspaceId,
          title,
          description,
          storagePath,
        });

        if (!result.ok) {
          const { error: removeError } = await supabase.storage
            .from(RESOURCE_STORAGE_BUCKET)
            .remove([storagePath]);

          if (removeError) console.error('[resource] 메타데이터 실패 후 파일 삭제 실패:', removeError);
          toast.error(result.message);
          return false;
        }
      } else {
        const result = await createLinkMutation.mutateAsync({
          workspaceId,
          title,
          description,
          url: values.url.trim(),
          linkProvider: values.linkProvider,
        });

        if (!result.ok) {
          toast.error(result.message);
          return false;
        }
      }

      await refetch();
      setIsDialogOpen(false);
      return true;
    } catch (error) {
      console.error('[resource] 자료 저장 실패:', error);
      toast.error('자료 저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
      return false;
    } finally {
      setIsUploadingFile(false);
    }
  };

  const openFile = async (resource: ResourceItem): Promise<void> => {
    try {
      const result = await downloadMutation.mutateAsync({ workspaceId, resourceId: resource.id });

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      // Storage signed URL의 download 응답을 현재 창에서 요청해 새 탭을 만들지 않습니다.
      window.location.assign(result.data.url);
    } catch {
      toast.error('파일 다운로드 링크를 만들지 못했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const updateExistingResource = async (values: {
    title: string;
    description: string;
    url?: string;
  }): Promise<boolean> => {
    if (!editingResourceId) return false;

    try {
      const result = await updateMutation.mutateAsync({
        workspaceId,
        resourceId: editingResourceId,
        title: values.title.trim(),
        description: values.description.trim(),
        url: values.url?.trim(),
      });

      if (!result.ok) {
        toast.error(result.message);
        return false;
      }

      await refetch();
      setEditingResourceId(null);
      return true;
    } catch {
      toast.error('자료 수정에 실패했습니다. 잠시 후 다시 시도해주세요.');
      return false;
    }
  };

  const removeResource = async (resourceId: string): Promise<void> => {
    try {
      const result = await deleteMutation.mutateAsync({ workspaceId, resourceId });

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      await refetch();
    } catch {
      toast.error('자료 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  return {
    resources: data.resources,
    isDialogOpen,
    dialogResourceType,
    editingResource: data.resources.find((resource) => resource.id === editingResourceId) ?? null,
    isLoading: isPending,
    isSaving:
      createLinkMutation.isPending ||
      isUploadingFile ||
      createFileMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
    openDialog: (nextResourceType: ResourceType) => {
      setDialogResourceType(nextResourceType);
      setIsDialogOpen(true);
    },
    closeDialog: () => setIsDialogOpen(false),
    addResource,
    openFile,
    openEditDialog: setEditingResourceId,
    closeEditDialog: () => setEditingResourceId(null),
    updateResource: updateExistingResource,
    deleteResource: removeResource,
    viewer: data.viewer,
  };
}

// Storage 키에는 확장자만 보존해 파일 종류를 유지하고, 원본 파일명은 자료 제목으로 보관합니다.
function getFileExtension(fileName: string): string {
  const extensionStart = fileName.lastIndexOf('.');
  if (extensionStart <= 0 || extensionStart === fileName.length - 1) return '';

  const extension = fileName.slice(extensionStart + 1).toLowerCase();
  return extension && /^[a-z0-9]{1,10}$/.test(extension) ? `.${extension}` : '';
}
