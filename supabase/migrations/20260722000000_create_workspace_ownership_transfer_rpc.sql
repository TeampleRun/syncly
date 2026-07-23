-- 워크스페이스 소유권 이전 RPC — 현재 소유자만, 같은 워크스페이스의 다른 멤버에게만 가능하다.
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