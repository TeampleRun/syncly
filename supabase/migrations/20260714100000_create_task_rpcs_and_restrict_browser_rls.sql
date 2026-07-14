-- task 생성/보드 갱신 RPC + 브라우저 직접 조회에 필요한 RLS 정리

-- 브라우저에서 직접 읽는 테이블은 dev_full_access를 제거하고 실제 멤버십 정책만 남긴다.
drop policy if exists dev_full_access on public.tasks;
drop policy if exists dev_full_access on public.workspace_members;
drop policy if exists dev_full_access on public.profiles;

-- profiles는 본인 또는 같은 워크스페이스 멤버의 프로필만 조회 가능하게 좁힌다.
drop policy if exists profiles_select on public.profiles;
create policy profiles_select_self_or_shared_workspace_member on public.profiles
  for select to authenticated
  using (
    id = auth.uid()
    or exists (
      select 1
      from public.workspace_members current_member
      join public.workspace_members target_member
        on target_member.workspace_id = current_member.workspace_id
      where current_member.user_id = auth.uid()
        and target_member.user_id = profiles.id
    )
  );

-- 업무 생성: 같은 워크스페이스 안에서 advisory lock으로 sort_order 경쟁을 직렬화한다.
create or replace function public.create_task(
  p_workspace_id uuid,
  p_title text,
  p_user_id uuid,
  p_due_date date default null
)
returns uuid
language plpgsql
set search_path = public, pg_temp
as $$
declare
  v_task_id uuid;
  v_next_sort_order int;
begin
  perform pg_advisory_xact_lock(hashtextextended(p_workspace_id::text, 0));

  select coalesce(max(sort_order), -1) + 1
    into v_next_sort_order
  from public.tasks
  where workspace_id = p_workspace_id
    and sprint_id is null;

  insert into public.tasks (
    workspace_id,
    title,
    assignee_id,
    created_by,
    due_date,
    sort_order,
    status,
    priority,
    sprint_id
  )
  values (
    p_workspace_id,
    p_title,
    p_user_id,
    p_user_id,
    p_due_date,
    v_next_sort_order,
    'todo',
    'medium',
    null
  )
  returning id into v_task_id;

  return v_task_id;
end;
$$;

-- 보드 갱신: 여러 task 상태/정렬 변경을 단일 트랜잭션으로 반영한다.
create or replace function public.update_task_board(
  p_workspace_id uuid,
  p_tasks jsonb
)
returns void
language plpgsql
set search_path = public, pg_temp
as $$
declare
  v_payload_count int;
  v_updated_count int;
begin
  v_payload_count := jsonb_array_length(p_tasks);

  if v_payload_count = 0 then
    return;
  end if;

  with payload as (
    select
      (item->>'id')::uuid as id,
      (item->>'status')::task_status as status,
      (item->>'sortOrder')::int as sort_order
    from jsonb_array_elements(p_tasks) as item
  )
  update public.tasks as task
  set
    status = payload.status,
    sort_order = payload.sort_order
  from payload
  where task.workspace_id = p_workspace_id
    and task.id = payload.id;

  get diagnostics v_updated_count = row_count;

  if v_updated_count <> v_payload_count then
    raise exception 'task board update payload mismatch: expected %, updated %', v_payload_count, v_updated_count;
  end if;
end;
$$;
