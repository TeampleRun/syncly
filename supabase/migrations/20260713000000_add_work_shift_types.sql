-- 매장 운영 워크스페이스별 근무유형을 저장하고, 기존 스케줄을 근무유형 FK로 이전한다.
begin;

create table public.work_shift_types (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  code text not null,
  name text not null,
  start_time time,
  end_time time,
  ends_next_day boolean not null default false,
  color text not null,
  is_off boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (workspace_id, code),
  unique (workspace_id, name),
  check (sort_order >= 0),
  check (color in ('sky', 'violet', 'amber', 'slate', 'emerald', 'rose')),
  check (
    (is_off and start_time is null and end_time is null)
    or (
      not is_off
      and start_time is not null
      and end_time is not null
      and (ends_next_day or end_time > start_time)
    )
  )
);

create index idx_work_shift_types_workspace_sort
  on public.work_shift_types (workspace_id, sort_order);

create trigger set_updated_at
before update on public.work_shift_types
for each row
execute procedure extensions.moddatetime(updated_at);

-- 매장 운영 워크스페이스마다 기본 근무유형을 만든다.
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
  workspace.id,
  shift.code,
  shift.name,
  shift.start_time,
  shift.end_time,
  shift.ends_next_day,
  shift.color,
  shift.is_off,
  shift.sort_order
from public.workspaces workspace
cross join (
  values
    ('open', '오픈', time '09:00', time '14:00', false, 'sky', false, 0),
    ('middle', '미들', time '14:00', time '19:00', false, 'violet', false, 1),
    ('close', '마감', time '19:00', time '00:00', true, 'amber', false, 2),
    ('off', '휴무', null, null, false, 'slate', true, 3)
) as shift(code, name, start_time, end_time, ends_next_day, color, is_off, sort_order)
where workspace.purpose = 'store_operation';

alter table public.work_schedule_entries
  add column shift_type_id uuid references public.work_shift_types(id) on delete restrict;

-- 기존 open/middle/close/off 문자열을 같은 워크스페이스의 근무유형 FK로 옮긴다.
update public.work_schedule_entries entry
set shift_type_id = shift.id
from public.work_shift_types shift
where shift.workspace_id = entry.workspace_id
  and shift.code = entry.shift_type;

do $$
begin
  if exists (
    select 1
    from public.work_schedule_entries
    where shift_type_id is null
  ) then
    raise exception '근무 스케줄의 shift_type_id 이전에 실패했습니다.';
  end if;
end;
$$;

alter table public.work_schedule_entries
  alter column shift_type_id set not null;

alter table public.work_schedule_entries
  drop column shift_type;

alter table public.work_shift_types enable row level security;

create policy work_shift_types_select_member
on public.work_shift_types
for select
to authenticated
using (private.is_workspace_member(workspace_id));

create policy work_shift_types_write_owner
on public.work_shift_types
for all
to authenticated
using (private.is_workspace_owner(workspace_id))
with check (private.is_workspace_owner(workspace_id));

-- 삭제 전 기존 배정값을 대체 근무유형으로 일괄 변경해 FK 정합성을 유지한다.
create function public.replace_and_delete_work_shift_type(
  p_workspace_id uuid,
  p_deleted_shift_type_id uuid,
  p_replacement_shift_type_id uuid
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if p_deleted_shift_type_id = p_replacement_shift_type_id then
    raise exception '삭제할 근무유형과 대체 근무유형은 달라야 합니다.';
  end if;

  if not exists (
    select 1
    from public.work_shift_types
    where id = p_deleted_shift_type_id
      and workspace_id = p_workspace_id
  ) then
    raise exception '삭제할 근무유형을 찾을 수 없습니다.';
  end if;

  if not exists (
    select 1
    from public.work_shift_types
    where id = p_replacement_shift_type_id
      and workspace_id = p_workspace_id
  ) then
    raise exception '대체 근무유형을 찾을 수 없습니다.';
  end if;

  update public.work_schedule_entries
  set shift_type_id = p_replacement_shift_type_id
  where workspace_id = p_workspace_id
    and shift_type_id = p_deleted_shift_type_id;

  delete from public.work_shift_types
  where id = p_deleted_shift_type_id
    and workspace_id = p_workspace_id;
end;
$$;

commit;
