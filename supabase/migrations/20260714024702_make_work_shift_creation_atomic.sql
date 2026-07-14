-- 근무유형 생성과 이번 주 기본 배정을 하나의 DB 트랜잭션으로 처리한다.
begin;

create function public.create_work_shift_type_and_ensure_weekly_entries(
  p_workspace_id uuid,
  p_week_start_date date
)
returns table (
  id uuid,
  code text,
  name text,
  start_time time,
  end_time time,
  ends_next_day boolean,
  color text,
  is_off boolean,
  default_shift_type_id uuid
)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_shift public.work_shift_types%rowtype;
  v_default_shift_type_id uuid;
  v_created_by uuid := auth.uid();
begin
  if v_created_by is null then
    raise exception '인증된 사용자만 근무유형을 추가할 수 있습니다.'
      using errcode = '28000';
  end if;

  if not private.is_workspace_owner(p_workspace_id) then
    raise exception '워크스페이스 소유자만 근무유형을 추가할 수 있습니다.'
      using errcode = '42501';
  end if;

  -- 동일 워크스페이스의 동시 추가 요청은 정렬 순서가 충돌하지 않도록 직렬화한다.
  perform 1
  from public.workspaces
  where id = p_workspace_id
  for update;

  if not found then
    raise exception '워크스페이스를 찾을 수 없습니다.';
  end if;

  insert into public.work_shift_types (
    workspace_id,
    code,
    name,
    start_time,
    end_time,
    ends_next_day,
    color,
    is_off,
    sort_order
  )
  select
    p_workspace_id,
    'custom-' || gen_random_uuid(),
    '새 근무',
    time '09:00',
    time '18:00',
    false,
    'emerald',
    false,
    coalesce(max(sort_order), -1) + 1
  from public.work_shift_types
  where workspace_id = p_workspace_id
  returning * into v_shift;

  select shift.id
  into v_default_shift_type_id
  from public.work_shift_types shift
  where shift.workspace_id = p_workspace_id
  order by shift.is_off asc, shift.sort_order asc
  limit 1;

  insert into public.work_schedule_entries (
    workspace_id,
    user_id,
    work_date,
    shift_type_id,
    created_by
  )
  select
    p_workspace_id,
    member.user_id,
    week_day.work_date::date,
    v_default_shift_type_id,
    v_created_by
  from public.workspace_members member
  cross join generate_series(
    p_week_start_date,
    p_week_start_date + 6,
    interval '1 day'
  ) as week_day(work_date)
  where member.workspace_id = p_workspace_id
  on conflict (workspace_id, user_id, work_date) do nothing;

  return query
  select
    v_shift.id,
    v_shift.code,
    v_shift.name,
    v_shift.start_time,
    v_shift.end_time,
    v_shift.ends_next_day,
    v_shift.color,
    v_shift.is_off,
    v_default_shift_type_id;
end;
$$;

revoke all on function public.create_work_shift_type_and_ensure_weekly_entries(uuid, date) from public;
grant execute on function public.create_work_shift_type_and_ensure_weekly_entries(uuid, date) to authenticated;

commit;
