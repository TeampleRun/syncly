-- 워크스페이스별 개인 알림을 저장하고 공지·업무 변경 시 자동 생성한다.

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  type text not null check (type in ('announcement_created', 'task_assigned', 'task_status_changed')),
  title text not null,
  body text,
  link_path text not null,
  metadata jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index notifications_recipient_created_at_idx
  on public.notifications (recipient_id, created_at desc);

alter table public.notifications enable row level security;

-- 앱 클라이언트에는 알림 생성·삭제 권한을 부여하지 않고 조회·읽음 처리만 허용한다.
revoke insert, delete on table public.notifications from anon, authenticated;
grant select, update on table public.notifications to authenticated;

create policy notifications_select_recipient
on public.notifications
for select
to authenticated
using (
  recipient_id = (select auth.uid())
  and private.is_workspace_member(workspace_id)
);

create policy notifications_update_recipient_read_state
on public.notifications
for update
to authenticated
using (
  recipient_id = (select auth.uid())
  and private.is_workspace_member(workspace_id)
)
with check (
  recipient_id = (select auth.uid())
  and private.is_workspace_member(workspace_id)
);

-- 수신자는 읽음 시각만 변경할 수 있고, 알림의 내용·대상·이동 경로는 불변으로 둔다.
create function private.prevent_notification_mutation()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.id is distinct from old.id
    or new.recipient_id is distinct from old.recipient_id
    or new.actor_id is distinct from old.actor_id
    or new.workspace_id is distinct from old.workspace_id
    or new.type is distinct from old.type
    or new.title is distinct from old.title
    or new.body is distinct from old.body
    or new.link_path is distinct from old.link_path
    or new.metadata is distinct from old.metadata
    or new.created_at is distinct from old.created_at then
    raise exception '알림의 읽음 상태 외 정보는 변경할 수 없습니다.';
  end if;

  return new;
end;
$$;

create trigger prevent_notification_mutation
before update on public.notifications
for each row
execute function private.prevent_notification_mutation();

-- 공지 작성자 이외의 현재 워크스페이스 멤버에게만 공지 알림을 생성한다.
create function private.create_announcement_notifications()
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

create trigger create_announcement_notifications
after insert on public.announcements
for each row
execute function private.create_announcement_notifications();

-- 업무가 생성·배정되거나 담당 업무 상태가 변경될 때 담당자에게 개인 알림을 생성한다.
create function private.create_task_assignee_notification()
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

create trigger create_task_assignee_notification
after insert or update of assignee_id, status on public.tasks
for each row
execute function private.create_task_assignee_notification();

-- 수신자 전용 RLS가 Realtime 변경 이벤트에도 적용되도록 publication에 포함한다.
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'notifications'
  ) then
    alter publication supabase_realtime add table public.notifications;
  end if;
end;
$$;
