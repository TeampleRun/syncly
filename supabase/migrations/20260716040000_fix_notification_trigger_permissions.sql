-- 이미 적용된 알림 마이그레이션에서 트리거가 notifications에 쓸 수 있도록 권한을 보정한다.
-- 앱 사용자는 직접 알림을 만들 수 없고, 공지·업무 변경 트리거만 제한적으로 생성한다.

create or replace function private.create_announcement_notifications()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.notifications (
    recipient_id,
    actor_id,
    workspace_id,
    type,
    title,
    body,
    link_path,
    metadata
  )
  select
    member.user_id,
    new.author_id,
    new.workspace_id,
    'announcement_created',
    '새 공지가 등록되었습니다.',
    new.title,
    format('/workspaces/%s/notices', new.workspace_id),
    jsonb_build_object('announcementId', new.id)
  from public.workspace_members as member
  where member.workspace_id = new.workspace_id
    and member.user_id is distinct from new.author_id;

  return new;
end;
$$;

revoke all on function private.create_announcement_notifications() from public;

create or replace function private.create_task_assignee_notification()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor_id uuid := auth.uid();
  v_link_path text;
begin
  select case workspace.purpose
    when 'side_project' then format('/workspaces/%s/sprint-board', new.workspace_id)
    when 'team_project' then format('/workspaces/%s/project-management', new.workspace_id)
    else format('/workspaces/%s/dashboard', new.workspace_id)
  end
  into v_link_path
  from public.workspaces as workspace
  where workspace.id = new.workspace_id;

  if new.assignee_id is null
    or new.assignee_id = v_actor_id
    or not exists (
      select 1
      from public.workspace_members as member
      where member.workspace_id = new.workspace_id
        and member.user_id = new.assignee_id
    ) then
    return new;
  end if;

  if tg_op = 'INSERT' or new.assignee_id is distinct from old.assignee_id then
    insert into public.notifications (
      recipient_id,
      actor_id,
      workspace_id,
      type,
      title,
      body,
      link_path,
      metadata
    ) values (
      new.assignee_id,
      v_actor_id,
      new.workspace_id,
      'task_assigned',
      '새 업무가 배정되었습니다.',
      new.title,
      v_link_path,
      jsonb_build_object('taskId', new.id)
    );
  elsif new.status is distinct from old.status then
    insert into public.notifications (
      recipient_id,
      actor_id,
      workspace_id,
      type,
      title,
      body,
      link_path,
      metadata
    ) values (
      new.assignee_id,
      v_actor_id,
      new.workspace_id,
      'task_status_changed',
      '담당 업무 상태가 변경되었습니다.',
      new.title,
      v_link_path,
      jsonb_build_object('taskId', new.id, 'status', new.status)
    );
  end if;

  return new;
end;
$$;

revoke all on function private.create_task_assignee_notification() from public;
