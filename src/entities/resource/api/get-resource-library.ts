'use server';

// 워크스페이스 범위의 자료 메타데이터와 업로더 이름을 함께 조회합니다.
import { z } from 'zod';
import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import type {
  ResourceItem,
  ResourceLibraryData,
  ResourceLinkProvider,
} from '../model/resource.types';

const workspaceIdSchema = z.guid();

function getLinkProvider(url: string | null): ResourceLinkProvider | undefined {
  if (!url) return undefined;

  try {
    const hostname = new URL(url).hostname;
    if (hostname.includes('notion')) return 'notion';
    if (hostname.includes('figma')) return 'figma';
    if (hostname.includes('github')) return 'github';
  } catch {
    return 'link';
  }

  return 'link';
}

function getFileName(storagePath: string | null): string | undefined {
  const objectName = storagePath?.split('/').at(-1);
  return objectName?.replace(/^[0-9a-f-]{36}-/, '');
}

export async function getResourceLibrary(workspaceId: string): Promise<ResourceLibraryData> {
  const parsedWorkspaceId = workspaceIdSchema.parse(workspaceId);
  const supabase = await createSupabaseServerClient();
  const { data: resources, error: resourceError } = await supabase
    .from('resources')
    .select(
      'id, workspace_id, uploaded_by, title, description, resource_type, url, storage_path, created_at',
    )
    .eq('workspace_id', parsedWorkspaceId)
    .order('created_at', { ascending: false });

  if (resourceError) throw new Error(`자료 조회에 실패했습니다: ${resourceError.message}`);

  const uploaderIds = [
    ...new Set(
      (resources ?? []).flatMap((resource) => (resource.uploaded_by ? [resource.uploaded_by] : [])),
    ),
  ];
  const { data: profiles, error: profileError } = uploaderIds.length
    ? await supabase.from('profiles').select('id, real_name').in('id', uploaderIds)
    : { data: [], error: null };

  if (profileError) throw new Error(`자료 업로더 조회에 실패했습니다: ${profileError.message}`);

  const profileNameById = new Map(
    (profiles ?? []).map((profile) => [profile.id, profile.real_name]),
  );

  return {
    resources: (resources ?? []).map((resource): ResourceItem => ({
      id: resource.id,
      workspaceId: resource.workspace_id,
      title: resource.title,
      description: resource.description ?? '',
      resourceType: resource.resource_type,
      linkProvider: getLinkProvider(resource.url),
      url: resource.url ?? undefined,
      storagePath: resource.storage_path ?? undefined,
      fileName: getFileName(resource.storage_path),
      uploadedBy: resource.uploaded_by
        ? (profileNameById.get(resource.uploaded_by) ?? '알 수 없음')
        : '탈퇴한 사용자',
      createdAt: resource.created_at.slice(0, 10),
    })),
  };
}
