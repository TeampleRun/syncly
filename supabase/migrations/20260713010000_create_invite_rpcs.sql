-- 초대 참여 도메인 RPC 2종
-- 공통: auth 연동 전이므로 p_user_id 파라미터로 유저를 받는다 (연동 후 auth.uid()로 교체 예정)
-- 비멤버는 RLS(workspaces_select_member)로 워크스페이스를 조회할 수 없으므로
-- 초대 코드 해석/참여는 security definer 함수로 RLS를 우회해 처리한다.

-- 초대 미리보기 — 활성(invite_enabled=true) + 유효한 코드일 때만 워크스페이스 요약을 반환한다.
-- 비활성/무효 코드는 빈 결과(no rows)를 반환해 참여 페이지에서 안내 처리한다.
create or replace function public.get_invite_preview(p_code text)
returns table (
  workspace_id uuid,
  name text,
  member_count int
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select
    w.id,
    w.name,
    (select count(*)::int from workspace_members wm where wm.workspace_id = w.id)
  from workspaces w
  where w.invite_code = p_code
    and w.invite_enabled = true;
$$;

-- 초대 코드로 워크스페이스 참여 — 활성/유효 검증 후 본인을 멤버로 추가하고 workspace_id를 반환한다.
-- 이미 멤버면 그대로 입장(멱등). 닉네임 기본값은 프로필 실명(create_workspace와 동일).
create or replace function public.join_workspace_by_invite_code(
  p_user_id uuid,
  p_code text
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_workspace_id uuid;
  v_nickname text;
begin
  -- 활성 + 유효 코드의 워크스페이스만 대상으로 한다.
  select w.id into v_workspace_id
  from workspaces w
  where w.invite_code = p_code
    and w.invite_enabled = true;

  if v_workspace_id is null then
    raise exception 'invalid_or_disabled_invite'
      using message = '유효하지 않거나 비활성화된 초대 링크입니다.';
  end if;

  -- 이미 참여한 멤버면 재참여 없이 그대로 입장한다(멱등).
  if exists (
    select 1 from workspace_members
    where workspace_id = v_workspace_id and user_id = p_user_id
  ) then
    return v_workspace_id;
  end if;

  -- 프로필 없는 유저면 여기서 실패(no rows 에러).
  select real_name into strict v_nickname from profiles where id = p_user_id;

  -- workspace_members는 (workspace_id, workspace_nickname) 유니크 제약이 있어
  -- 실명이 기존 멤버와 충돌하면 짧은 접미사를 붙여 한 번 재시도한다.
  begin
    insert into workspace_members (workspace_id, user_id, workspace_nickname, role)
    values (v_workspace_id, p_user_id, v_nickname, 'member');
  exception when unique_violation then
    insert into workspace_members (workspace_id, user_id, workspace_nickname, role)
    values (
      v_workspace_id,
      p_user_id,
      v_nickname || '-' || substr(encode(extensions.gen_random_bytes(2), 'hex'), 1, 4),
      'member'
    );
  end;

  return v_workspace_id;
end;
$$;
