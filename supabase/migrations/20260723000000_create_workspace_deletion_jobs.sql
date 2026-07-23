-- 워크스페이스 삭제 선점 메커니즘 — TOCTOU 없이 삭제와 소유권 이전이 같은 workspaces row를 두고 직렬화되도록 한다.
-- 삭제는 "선점(reserved) → 진행 전환(deleting) → Storage 목록 조회·배치 삭제(목록이 빌 때까지 반복) → 완료
-- (finalize)" 순서로 나누고, workspace row와 owner 멤버십은 finalize 전까지 그대로 유지되므로 Storage RLS를
-- 그대로 통과한다(admin 클라이언트 불필요). reserved 상태(아직 deleting 전환 전)는 10분 지나면 자동 만료돼,
-- 전환 전에 실패하고 사용자가 포기해도 소유권 이전/업로드가 영구히 막히지 않는다. 반면 deleting 상태(신규 업로드가
-- 확실히 막힌 이후)는 자동 만료되지 않아, Storage 정리가 중간에 끊겨도 워크스페이스는 남고 파일만 사라지는
-- 상황을 막는다. workspaces에 대한 직접 DELETE RLS는 제거해, finalize_workspace_deletion(security definer)을
-- 거치지 않고는 워크스페이스를 지울 수 없게 한다. finalize 내부에서도 storage.objects에 남은 파일이
-- 있는지 조회만 해서(delete/update 없음) 있으면 거부해, begin→mark→finalize만 직접 호출해 Storage
-- 정리를 우회하는 경로를 막는다.

begin;

create table if not exists public.workspace_deletion_jobs (
  workspace_id uuid primary key references public.workspaces(id) on delete cascade,
  initiated_by uuid not null references auth.users(id),
  deletion_token uuid not null default gen_random_uuid(),
  status text not null default 'reserved' check (status in ('reserved', 'deleting')),
  created_at timestamptz not null default now()
);

-- RLS만으로도 기본 거부지만, anon/authenticated의 테이블 권한 자체도 명시적으로 없애
-- PostgREST로 직접 읽거나 쓸 수 없게 한다. 아래 security definer RPC/헬퍼로만 접근한다.
alter table public.workspace_deletion_jobs enable row level security;
revoke all on public.workspace_deletion_jobs from anon, authenticated;

-- 활성 삭제 작업이 있는지 확인하는 헬퍼 — 소유권 이전 RPC와 Storage 업로드 정책에서 공용으로 쓴다.
-- deleting은 항상 활성으로 보고, reserved는 10분 이내일 때만 활성으로 본다.
create or replace function private.has_active_workspace_deletion_job(p_workspace_id uuid)
returns boolean
language sql stable security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from workspace_deletion_jobs
    where workspace_id = p_workspace_id
      and (status = 'deleting' or created_at >= now() - interval '10 minutes')
  );
$$;

grant execute on function private.has_active_workspace_deletion_job(uuid) to authenticated;
revoke execute on function private.has_active_workspace_deletion_job(uuid) from anon, public;

-- 삭제 선점 — owner 확인 후 삭제 작업을 원자적으로 생성/재획득한다.
-- deleting 상태이거나 만료되지 않은 reserved 상태를 다른 사람이 선점 중이면 거부하고,
-- 본인 job이면(reserved든 deleting이든) token을 그대로 재사용해 이어서 진행할 수 있게 한다.
create or replace function public.begin_workspace_deletion(p_workspace_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_caller uuid := auth.uid();
  v_owner_id uuid;
  v_job workspace_deletion_jobs%rowtype;
  v_token uuid;
begin
  if v_caller is null then
    raise exception '인증된 사용자만 워크스페이스를 삭제할 수 있습니다.'
      using errcode = '28000';
  end if;

  -- 동시 소유권 이전 요청과 겹치지 않도록 워크스페이스 row를 잠근다.
  select owner_id into v_owner_id
  from workspaces
  where id = p_workspace_id
  for update;

  if not found then
    raise exception '워크스페이스를 찾을 수 없습니다.';
  end if;

  if v_owner_id != v_caller then
    raise exception '워크스페이스 소유자만 삭제할 수 있습니다.'
      using errcode = '42501';
  end if;

  select * into v_job
  from workspace_deletion_jobs
  where workspace_id = p_workspace_id
  for update;

  if found then
    if v_job.status = 'deleting' then
      if v_job.initiated_by != v_caller then
        raise exception '이미 다른 삭제 작업이 진행 중입니다.';
      end if;
      -- 이미 파일 삭제가 시작된 job — 자동 만료 대상이 아니므로 token을 그대로 재사용한다.
      return v_job.deletion_token;
    end if;

    if v_job.created_at >= now() - interval '10 minutes' then
      if v_job.initiated_by != v_caller then
        raise exception '이미 다른 삭제 작업이 진행 중입니다.';
      end if;
      -- 만료되지 않은 본인 예약 — token을 그대로 재사용한다.
      return v_job.deletion_token;
    end if;
    -- 10분 넘게 지난 reserved job은 방치된 것으로 보고 새로 선점한다.
  end if;

  v_token := gen_random_uuid();

  insert into workspace_deletion_jobs (workspace_id, initiated_by, deletion_token, status, created_at)
  values (p_workspace_id, v_caller, v_token, 'reserved', now())
  on conflict (workspace_id)
  do update set initiated_by = excluded.initiated_by,
                deletion_token = excluded.deletion_token,
                status = 'reserved',
                created_at = excluded.created_at;

  return v_token;
end;
$$;

revoke all on function public.begin_workspace_deletion(uuid) from public;
grant execute on function public.begin_workspace_deletion(uuid) to authenticated;

-- Storage 목록 조회·삭제를 시작하기 전에 호출한다. 이 시점부터 job은 deleting 상태가 되어
-- 자동 만료되지 않고, 신규 업로드도 확실히 막혀서 이후의 목록 조회가 최종 스냅숏이 된다.
create or replace function public.mark_workspace_deletion_in_progress(
  p_workspace_id uuid,
  p_deletion_token uuid
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_caller uuid := auth.uid();
  v_owner_id uuid;
  v_job workspace_deletion_jobs%rowtype;
begin
  if v_caller is null then
    raise exception '인증된 사용자만 워크스페이스를 삭제할 수 있습니다.'
      using errcode = '28000';
  end if;

  select owner_id into v_owner_id
  from workspaces
  where id = p_workspace_id
  for update;

  if not found then
    raise exception '워크스페이스를 찾을 수 없습니다.';
  end if;

  if v_owner_id != v_caller then
    raise exception '워크스페이스 소유자만 삭제를 진행할 수 있습니다.'
      using errcode = '42501';
  end if;

  select * into v_job
  from workspace_deletion_jobs
  where workspace_id = p_workspace_id
  for update;

  if not found
     or v_job.initiated_by != v_caller
     or v_job.deletion_token != p_deletion_token
     or (v_job.status = 'reserved' and v_job.created_at < now() - interval '10 minutes') then
    raise exception '삭제 작업이 만료되었거나 유효하지 않습니다. 다시 시도해주세요.';
  end if;

  update workspace_deletion_jobs
  set status = 'deleting'
  where workspace_id = p_workspace_id;
end;
$$;

revoke all on function public.mark_workspace_deletion_in_progress(uuid, uuid) from public;
grant execute on function public.mark_workspace_deletion_in_progress(uuid, uuid) to authenticated;

-- 삭제 완료 — Storage 정리가 끝난 뒤 호출한다. deleting 상태 + token이 유효할 때만 실제로 workspaces row를 지운다.
create or replace function public.finalize_workspace_deletion(
  p_workspace_id uuid,
  p_deletion_token uuid
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_caller uuid := auth.uid();
  v_owner_id uuid;
  v_job workspace_deletion_jobs%rowtype;
begin
  if v_caller is null then
    raise exception '인증된 사용자만 워크스페이스를 삭제할 수 있습니다.'
      using errcode = '28000';
  end if;

  select owner_id into v_owner_id
  from workspaces
  where id = p_workspace_id
  for update;

  if not found then
    raise exception '워크스페이스를 찾을 수 없습니다.';
  end if;

  if v_owner_id != v_caller then
    raise exception '워크스페이스 소유자만 삭제를 완료할 수 있습니다.'
      using errcode = '42501';
  end if;

  select * into v_job
  from workspace_deletion_jobs
  where workspace_id = p_workspace_id
  for update;

  if not found
     or v_job.status != 'deleting'
     or v_job.initiated_by != v_caller
     or v_job.deletion_token != p_deletion_token then
    raise exception '삭제 작업이 유효하지 않습니다. 다시 시도해주세요.';
  end if;

  -- owner가 Storage 정리 없이 begin → mark → finalize만 직접 호출해 우회하지 못하도록,
  -- 실제로 남은 파일이 있는지 확인만 하고(조회 전용, delete/update 없음) 있으면 거부한다.
  if exists (
    select 1 from storage.objects
    where bucket_id = 'workspace-resources'
      and (storage.foldername(name))[1] = p_workspace_id::text
  ) then
    raise exception '삭제되지 않은 Storage 파일이 남아있어 워크스페이스를 삭제할 수 없습니다.';
  end if;

  delete from workspaces where id = p_workspace_id;
  -- workspace_deletion_jobs row는 workspaces에 대한 on delete cascade로 함께 삭제된다.
end;
$$;

revoke all on function public.finalize_workspace_deletion(uuid, uuid) from public;
grant execute on function public.finalize_workspace_deletion(uuid, uuid) to authenticated;

-- 소유권 이전 중에도 활성 삭제 작업이 있으면 거부한다(워크스페이스 row 잠금으로 begin_workspace_deletion과 직렬화됨).
create or replace function public.transfer_workspace_ownership(
  p_workspace_id uuid,
  p_new_owner_id uuid
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_caller uuid := auth.uid();
  v_current_owner_id uuid;
begin
  if v_caller is null then
    raise exception '인증된 사용자만 소유권을 이전할 수 있습니다.'
      using errcode = '28000';
  end if;

  if p_new_owner_id = v_caller then
    raise exception '자기 자신에게는 소유권을 이전할 수 없습니다.';
  end if;

  -- 동시 이전/삭제 요청과 겹치지 않도록 워크스페이스 row를 잠근다.
  select owner_id into v_current_owner_id
  from workspaces
  where id = p_workspace_id
  for update;

  if not found then
    raise exception '워크스페이스를 찾을 수 없습니다.';
  end if;

  if v_current_owner_id != v_caller then
    raise exception '워크스페이스 소유자만 소유권을 이전할 수 있습니다.'
      using errcode = '42501';
  end if;

  if private.has_active_workspace_deletion_job(p_workspace_id) then
    raise exception '워크스페이스 삭제가 진행 중이라 소유권을 이전할 수 없습니다.';
  end if;

  -- 대상 멤버 row도 잠가, 확인과 role 변경 사이에 본인이 탈퇴(row 삭제)하는 걸 막는다.
  perform 1 from workspace_members
  where workspace_id = p_workspace_id and user_id = p_new_owner_id
  for update;

  if not found then
    raise exception '대상 사용자는 이 워크스페이스의 멤버가 아닙니다.';
  end if;

  update workspace_members
  set role = 'owner'
  where workspace_id = p_workspace_id and user_id = p_new_owner_id;

  update workspace_members
  set role = 'member'
  where workspace_id = p_workspace_id and user_id = v_caller;

  update workspaces
  set owner_id = p_new_owner_id
  where id = p_workspace_id;
end;
$$;

revoke all on function public.transfer_workspace_ownership(uuid, uuid) from public;
grant execute on function public.transfer_workspace_ownership(uuid, uuid) to authenticated;

-- 활성 삭제 작업이 있는 워크스페이스에는 신규 파일 업로드를 막는다(삭제 도중 새 파일이 올라오는 경우 방지).
drop policy if exists workspace_resources_insert_member on storage.objects;

create policy workspace_resources_insert_member
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'workspace-resources'
  and private.is_workspace_member(
    case
      when (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
        then (storage.foldername(name))[1]::uuid
      else null
    end
  )
  and not private.has_active_workspace_deletion_job(
    case
      when (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
        then (storage.foldername(name))[1]::uuid
      else null
    end
  )
);

-- owner가 finalize_workspace_deletion을 거치지 않고 workspaces row를 직접 DELETE하는 걸 막는다.
-- 이후로는 security definer인 finalize_workspace_deletion(RLS 우회)을 통해서만 삭제할 수 있다.
drop policy if exists workspaces_delete_owner on public.workspaces;

commit;