'use server';

// 링크·파일 자료를 워크스페이스 멤버 권한으로 저장하고 파일은 짧은 수명의 signed URL로 제공합니다.
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {
  RESOURCE_LINK_PROVIDERS,
  type ResourceLinkProvider,
} from '../model/resource.types';
import { getCurrentUserId } from '@/shared/api/supabase/current-user';
import { createSupabaseServerClient } from '@/shared/api/supabase/server';

const RESOURCE_STORAGE_BUCKET = 'workspace-resources';
const uuidSchema = z.guid();
const linkProviderSchema = z.enum(RESOURCE_LINK_PROVIDERS);
const resourceContentSchema = z.object({
  title: z.string().trim().min(1, '자료 제목을 입력해주세요.').max(120),
  description: z.string().trim().max(1_000),
});
const externalUrlSchema = z
  .url('올바른 링크 주소를 입력해주세요.')
  .refine((url) => ['http:', 'https:'].includes(new URL(url).protocol), {
    message: 'http 또는 https 링크만 저장할 수 있습니다.',
  });

type WorkspaceMember = { user_id: string; role: 'owner' | 'member' };
type EditableResource = {
  id: string;
  uploaded_by: string | null;
  resource_type: 'file' | 'link';
  storage_path: string | null;
};

export type ResourceActionResult<T> = { ok: true; data: T } | { ok: false; message: string };

class ResourceActionError extends Error {}

function throwResourceActionError(message: string): never {
  throw new ResourceActionError(message);
}

function toActionFailure(error: unknown, fallbackMessage: string): ResourceActionResult<never> {
  if (error instanceof ResourceActionError) return { ok: false, message: error.message };

  console.error('[resource action] 예상하지 못한 오류:', error);
  return { ok: false, message: fallbackMessage };
}

function revalidateResourcePages(workspaceId: string): void {
  revalidatePath(`/workspaces/${workspaceId}/files`);
  revalidatePath(`/workspaces/${workspaceId}/dashboard`);
}

function getDownloadFileName(storagePath: string, fallbackTitle: string): string {
  const extension = storagePath.split('/').at(-1)?.match(/\.[a-z0-9]{1,10}$/i)?.[0] ?? '';
  return fallbackTitle.toLowerCase().endsWith(extension.toLowerCase())
    ? fallbackTitle
    : `${fallbackTitle}${extension}`;
}

async function getCurrentWorkspaceMember(workspaceId: string): Promise<{
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
  member: WorkspaceMember;
}> {
  const supabase = await createSupabaseServerClient();
  const currentUserId = await getCurrentUserId();
  const { data, error } = await supabase
    .from('workspace_members')
    .select('user_id, role')
    .eq('workspace_id', workspaceId)
    .eq('user_id', currentUserId)
    .maybeSingle();

  if (error) {
    console.error('[resource action] 워크스페이스 멤버 확인 실패:', error);
    throwResourceActionError('워크스페이스 멤버 정보를 확인하지 못했습니다.');
  }

  if (!data) throwResourceActionError('워크스페이스 멤버만 자료를 관리할 수 있습니다.');

  return { supabase, member: data };
}

async function getEditableResource(input: { workspaceId: string; resourceId: string }): Promise<{
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
  resource: EditableResource;
}> {
  const { supabase, member } = await getCurrentWorkspaceMember(input.workspaceId);
  const { data: resource, error } = await supabase
    .from('resources')
    .select('id, uploaded_by, resource_type, storage_path')
    .eq('id', input.resourceId)
    .eq('workspace_id', input.workspaceId)
    .maybeSingle();

  if (error) {
    console.error('[resource action] 자료 조회 실패:', error);
    throwResourceActionError('자료 정보를 확인하지 못했습니다.');
  }

  if (!resource) throwResourceActionError('자료를 찾을 수 없습니다.');

  if (member.role !== 'owner' && resource.uploaded_by !== member.user_id) {
    throwResourceActionError(
      '업로더 또는 워크스페이스 소유자만 자료를 수정하거나 삭제할 수 있습니다.',
    );
  }

  return { supabase, resource };
}

export async function createLinkResource(input: {
  workspaceId: string;
  title: string;
  description: string;
  url: string;
  linkProvider: ResourceLinkProvider;
}): Promise<ResourceActionResult<{ id: string }>> {
  try {
    const value = z
      .object({ workspaceId: uuidSchema, url: externalUrlSchema, linkProvider: linkProviderSchema })
      .merge(resourceContentSchema)
      .parse(input);
    const { supabase, member } = await getCurrentWorkspaceMember(value.workspaceId);
    const { data, error } = await supabase
      .from('resources')
      .insert({
        workspace_id: value.workspaceId,
        uploaded_by: member.user_id,
        title: value.title,
        description: value.description || null,
        resource_type: 'link',
        link_provider: value.linkProvider,
        url: value.url,
        storage_path: null,
      })
      .select('id')
      .single();

    if (error) {
      console.error('[resource action] 링크 저장 실패:', error);
      throwResourceActionError('링크 저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }

    revalidateResourcePages(value.workspaceId);
    return { ok: true, data: { id: data.id } };
  } catch (error) {
    return toActionFailure(error, '링크 저장에 실패했습니다. 입력값을 확인해주세요.');
  }
}

// 브라우저에서 Storage 업로드를 마친 파일의 메타데이터만 DB에 저장합니다.
export async function createFileResource(input: {
  workspaceId: string;
  title: string;
  description: string;
  storagePath: string;
}): Promise<ResourceActionResult<{ id: string }>> {
  try {
    const value = resourceContentSchema.parse({
      title: input.title,
      description: input.description,
    });
    const workspaceId = uuidSchema.parse(input.workspaceId);
    const storagePath = z.string().trim().min(1).max(512).parse(input.storagePath);

    if (!storagePath.startsWith(`${workspaceId}/`)) {
      throwResourceActionError('올바르지 않은 파일 경로입니다.');
    }

    const { supabase, member } = await getCurrentWorkspaceMember(workspaceId);
    const { data, error: resourceError } = await supabase
      .from('resources')
      .insert({
        workspace_id: workspaceId,
        uploaded_by: member.user_id,
        title: value.title,
        description: value.description || null,
        resource_type: 'file',
        link_provider: null,
        url: null,
        storage_path: storagePath,
      })
      .select('id')
      .single();

    if (resourceError) {
      console.error('[resource action] 파일 메타데이터 저장 실패:', resourceError);
      throwResourceActionError('파일 정보 저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }

    revalidateResourcePages(workspaceId);
    return { ok: true, data: { id: data.id } };
  } catch (error) {
    return toActionFailure(error, '파일 정보 저장에 실패했습니다. 입력값을 확인해주세요.');
  }
}

export async function getResourceDownloadUrl(input: {
  workspaceId: string;
  resourceId: string;
}): Promise<ResourceActionResult<{ url: string }>> {
  try {
    const value = z.object({ workspaceId: uuidSchema, resourceId: uuidSchema }).parse(input);
    const { supabase } = await getCurrentWorkspaceMember(value.workspaceId);
    const { data: resource, error } = await supabase
      .from('resources')
      .select('title, resource_type, storage_path')
      .eq('id', value.resourceId)
      .eq('workspace_id', value.workspaceId)
      .maybeSingle();

    if (error) {
      console.error('[resource action] 다운로드 대상 조회 실패:', error);
      throwResourceActionError('자료 정보를 확인하지 못했습니다.');
    }

    if (!resource || resource.resource_type !== 'file' || !resource.storage_path) {
      throwResourceActionError('다운로드할 파일을 찾을 수 없습니다.');
    }

    const { data, error: signedUrlError } = await supabase.storage
      .from(RESOURCE_STORAGE_BUCKET)
      .createSignedUrl(resource.storage_path, 60, {
        download: getDownloadFileName(resource.storage_path, resource.title),
      });

    if (signedUrlError || !data) {
      console.error('[resource action] 다운로드 URL 생성 실패:', signedUrlError);
      throwResourceActionError(
        '파일 다운로드 링크를 만들지 못했습니다. 잠시 후 다시 시도해주세요.',
      );
    }

    return { ok: true, data: { url: data.signedUrl } };
  } catch (error) {
    return toActionFailure(error, '파일 다운로드 링크를 만들지 못했습니다.');
  }
}

export async function updateResource(input: {
  workspaceId: string;
  resourceId: string;
  title: string;
  description: string;
  url?: string;
}): Promise<ResourceActionResult<void>> {
  try {
    const value = z
      .object({ workspaceId: uuidSchema, resourceId: uuidSchema, url: z.string().optional() })
      .merge(resourceContentSchema)
      .parse(input);
    const { supabase, resource } = await getEditableResource(value);
    const updateData = {
      title: value.title,
      description: value.description || null,
      ...(resource.resource_type === 'link' ? { url: externalUrlSchema.parse(value.url) } : {}),
    };
    const { error } = await supabase
      .from('resources')
      .update(updateData)
      .eq('id', value.resourceId)
      .eq('workspace_id', value.workspaceId);

    if (error) {
      console.error('[resource action] 자료 수정 실패:', error);
      throwResourceActionError('자료 수정에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }

    revalidateResourcePages(value.workspaceId);
    return { ok: true, data: undefined };
  } catch (error) {
    return toActionFailure(error, '자료 수정에 실패했습니다. 입력값을 확인해주세요.');
  }
}

export async function deleteResource(input: {
  workspaceId: string;
  resourceId: string;
}): Promise<ResourceActionResult<void>> {
  try {
    const value = z.object({ workspaceId: uuidSchema, resourceId: uuidSchema }).parse(input);
    const { supabase, resource } = await getEditableResource(value);
    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', value.resourceId)
      .eq('workspace_id', value.workspaceId);

    if (error) {
      console.error('[resource action] 자료 삭제 실패:', error);
      throwResourceActionError('자료 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }

    // DB 삭제에 성공한 자료만 Storage에서 지운다. Storage 삭제가 실패해도 화면에 깨진 항목은 남기지 않는다.
    if (resource.storage_path) {
      const { error: removeError } = await supabase.storage
        .from(RESOURCE_STORAGE_BUCKET)
        .remove([resource.storage_path]);

      if (removeError) console.error('[resource action] 파일 객체 삭제 실패:', removeError);
    }

    revalidateResourcePages(value.workspaceId);
    return { ok: true, data: undefined };
  } catch (error) {
    return toActionFailure(error, '자료 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }
}
