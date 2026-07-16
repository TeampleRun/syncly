// 현재 워크스페이스 멤버만 공지·자료실·업무·채팅을 통합 검색할 수 있는 Route Handler입니다.
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import type { WorkspaceSearchResult } from '@/entities/workspace-search';
import { getCurrentUserId } from '@/shared/api/supabase/current-user';
import { createSupabaseServerClient } from '@/shared/api/supabase/server';

const requestSchema = z.object({
  workspaceId: z.guid(),
  query: z.string().trim().max(100),
});
const SEARCH_RESULT_LIMIT = 5;

type SearchableRow = { id: string; title: string; description: string | null };

function escapeLikePattern(query: string): string {
  return query.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_');
}

function mergeRows(...groups: SearchableRow[][]): SearchableRow[] {
  const rowById = new Map<string, SearchableRow>();
  groups.flat().forEach((row) => rowById.set(row.id, row));
  return [...rowById.values()].slice(0, SEARCH_RESULT_LIMIT);
}

function getTaskHref(workspaceId: string, purpose: string): string {
  if (purpose === 'side_project') return `/workspaces/${workspaceId}/sprint-board`;
  if (purpose === 'team_project') return `/workspaces/${workspaceId}/project-management`;
  return `/workspaces/${workspaceId}/dashboard`;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ workspaceId: string }> },
) {
  const { workspaceId } = await context.params;
  const parsed = requestSchema.safeParse({
    workspaceId,
    query: request.nextUrl.searchParams.get('q') ?? '',
  });

  if (!parsed.success) {
    return NextResponse.json(
      { message: '검색어 또는 워크스페이스 정보가 올바르지 않습니다.' },
      { status: 400 },
    );
  }

  if (parsed.data.query.length < 2) {
    return NextResponse.json({ results: [] satisfies WorkspaceSearchResult[] });
  }

  try {
    const supabase = await createSupabaseServerClient();
    // 모든 검색 원본을 현재 사용자와 선택한 워크스페이스 범위로 제한하는 기준값입니다.
    const currentUserId = await getCurrentUserId();
    const [
      { data: membership, error: membershipError },
      { data: workspace, error: workspaceError },
    ] = await Promise.all([
      supabase
        .from('workspace_members')
        .select('user_id')
        .eq('workspace_id', parsed.data.workspaceId)
        .eq('user_id', currentUserId)
        .maybeSingle(),
      supabase.from('workspaces').select('purpose').eq('id', parsed.data.workspaceId).maybeSingle(),
    ]);

    if (membershipError || workspaceError) {
      console.error('[workspace search] 권한 확인 실패:', membershipError ?? workspaceError);
      return NextResponse.json({ message: '검색 권한을 확인하지 못했습니다.' }, { status: 500 });
    }

    if (!membership || !workspace) {
      return NextResponse.json(
        { message: '워크스페이스 멤버만 검색할 수 있습니다.' },
        { status: 403 },
      );
    }

    const pattern = `%${escapeLikePattern(parsed.data.query)}%`;
    const [
      announcementTitle,
      announcementContent,
      resourceTitle,
      resourceDescription,
      taskTitle,
      taskDescription,
      chatContent,
      meetingNoteTitle,
      meetingNoteContent,
      calendarEventTitle,
      calendarEventDescription,
    ] = await Promise.all([
      supabase
        .from('announcements')
        .select('id, title, content')
        .eq('workspace_id', parsed.data.workspaceId)
        .ilike('title', pattern)
        .limit(SEARCH_RESULT_LIMIT),
      supabase
        .from('announcements')
        .select('id, title, content')
        .eq('workspace_id', parsed.data.workspaceId)
        .ilike('content', pattern)
        .limit(SEARCH_RESULT_LIMIT),
      supabase
        .from('resources')
        .select('id, title, description')
        .eq('workspace_id', parsed.data.workspaceId)
        .ilike('title', pattern)
        .limit(SEARCH_RESULT_LIMIT),
      supabase
        .from('resources')
        .select('id, title, description')
        .eq('workspace_id', parsed.data.workspaceId)
        .ilike('description', pattern)
        .limit(SEARCH_RESULT_LIMIT),
      supabase
        .from('tasks')
        .select('id, title, description')
        .eq('workspace_id', parsed.data.workspaceId)
        .ilike('title', pattern)
        .limit(SEARCH_RESULT_LIMIT),
      supabase
        .from('tasks')
        .select('id, title, description')
        .eq('workspace_id', parsed.data.workspaceId)
        .ilike('description', pattern)
        .limit(SEARCH_RESULT_LIMIT),
      supabase
        .from('chat_messages')
        .select('id, content')
        .eq('workspace_id', parsed.data.workspaceId)
        .ilike('content', pattern)
        .limit(SEARCH_RESULT_LIMIT),
      supabase
        .from('meeting_notes')
        .select('id, title, content')
        .eq('workspace_id', parsed.data.workspaceId)
        .ilike('title', pattern)
        .limit(SEARCH_RESULT_LIMIT),
      supabase
        .from('meeting_notes')
        .select('id, title, content')
        .eq('workspace_id', parsed.data.workspaceId)
        .ilike('content', pattern)
        .limit(SEARCH_RESULT_LIMIT),
      supabase
        .from('calendar_events')
        .select('id, title, description')
        .eq('workspace_id', parsed.data.workspaceId)
        .ilike('title', pattern)
        .limit(SEARCH_RESULT_LIMIT),
      supabase
        .from('calendar_events')
        .select('id, title, description')
        .eq('workspace_id', parsed.data.workspaceId)
        .ilike('description', pattern)
        .limit(SEARCH_RESULT_LIMIT),
    ]);

    const errors = [
      announcementTitle.error,
      announcementContent.error,
      resourceTitle.error,
      resourceDescription.error,
      taskTitle.error,
      taskDescription.error,
      chatContent.error,
      meetingNoteTitle.error,
      meetingNoteContent.error,
      calendarEventTitle.error,
      calendarEventDescription.error,
    ];

    if (errors.some(Boolean)) {
      console.error('[workspace search] 검색 조회 실패:', errors.find(Boolean));
      return NextResponse.json({ message: '검색 결과를 불러오지 못했습니다.' }, { status: 500 });
    }

    const announcementRows = mergeRows(
      (announcementTitle.data ?? []).map((row) => ({
        id: row.id,
        title: row.title,
        description: row.content,
      })),
      (announcementContent.data ?? []).map((row) => ({
        id: row.id,
        title: row.title,
        description: row.content,
      })),
    );
    const resourceRows = mergeRows(
      (resourceTitle.data ?? []).map((row) => ({
        id: row.id,
        title: row.title,
        description: row.description,
      })),
      (resourceDescription.data ?? []).map((row) => ({
        id: row.id,
        title: row.title,
        description: row.description,
      })),
    );
    const taskRows = mergeRows(
      (taskTitle.data ?? []).map((row) => ({
        id: row.id,
        title: row.title,
        description: row.description,
      })),
      (taskDescription.data ?? []).map((row) => ({
        id: row.id,
        title: row.title,
        description: row.description,
      })),
    );
    const chatRows = (chatContent.data ?? []).map((row) => ({
      id: row.id,
      title: row.content,
      description: null,
    }));
    const meetingNoteRows = mergeRows(
      (meetingNoteTitle.data ?? []).map((row) => ({
        id: row.id,
        title: row.title,
        description: row.content,
      })),
      (meetingNoteContent.data ?? []).map((row) => ({
        id: row.id,
        title: row.title,
        description: row.content,
      })),
    );
    const calendarEventRows = mergeRows(
      (calendarEventTitle.data ?? []).map((row) => ({
        id: row.id,
        title: row.title,
        description: row.description,
      })),
      (calendarEventDescription.data ?? []).map((row) => ({
        id: row.id,
        title: row.title,
        description: row.description,
      })),
    );

    const results: WorkspaceSearchResult[] = [
      ...announcementRows.map((row) => ({
        ...row,
        type: 'announcement' as const,
        href: `/workspaces/${parsed.data.workspaceId}/notices`,
      })),
      ...resourceRows.map((row) => ({
        ...row,
        type: 'resource' as const,
        href: `/workspaces/${parsed.data.workspaceId}/files`,
      })),
      ...taskRows.map((row) => ({
        ...row,
        type: 'task' as const,
        href: getTaskHref(parsed.data.workspaceId, workspace.purpose),
      })),
      ...chatRows.map((row) => ({
        ...row,
        type: 'chat' as const,
        href: `/workspaces/${parsed.data.workspaceId}/chat`,
      })),
      ...meetingNoteRows.map((row) => ({
        ...row,
        type: 'meetingNote' as const,
        href: `/workspaces/${parsed.data.workspaceId}/meeting-notes`,
      })),
      ...calendarEventRows.map((row) => ({
        ...row,
        type: 'calendarEvent' as const,
        href: `/workspaces/${parsed.data.workspaceId}/calendar`,
      })),
    ];

    return NextResponse.json({ results });
  } catch (error) {
    console.error('[workspace search] 예상하지 못한 오류:', error);
    return NextResponse.json({ message: '검색 결과를 불러오지 못했습니다.' }, { status: 500 });
  }
}
