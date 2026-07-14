-- 초대 RPC 보안 강화
-- join_workspace_by_invite_code: 참여자를 RPC 인자가 아닌 인증 세션(auth.uid())으로 강제한다.
--   기존 p_user_id 인자를 제거해 호출자가 임의의 사용자를 워크스페이스에 가입시키지 못하게 한다.
-- 두 함수 모두 security definer + public 스키마이므로 기본 EXECUTE를 회수하고 필요한 롤에만 부여한다.
-- 트랜잭션은 마이그레이션 러너가 감싸므로 파일 내 begin/commit은 두지 않는다.

-- 인자 시그니처가 바뀌므로(uuid 인자 제거) create or replace가 아닌 drop 후 재생성한다.
drop function if exists public.join_workspace_by_invite_code(uuid, text);

-- 초대 코드로 워크스페이스 참여 — 활성/유효 검증 후 본인을 멤버로 추가하고 workspace_id를 반환한다.
-- 이미 멤버면 그대로 입장(멱등). 닉네임 기본값은 프로필 실명(create_workspace와 동일).
create function public.join_workspace_by_invite_code(
  p_code text
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_workspace_id uuid;
  v_user_id uuid := auth.uid();
  v_nickname text;
begin
  if v_user_id is null then
    raise exception '인증된 사용자만 워크스페이스에 참여할 수 있습니다.'
      using errcode = '28000';
  end if;

  -- 활성 + 유효 코드의 워크스페이스만 대상으로 한다.
  select w.id into v_workspace_id
  from workspaces w
  where w.invite_code = p_code
    and w.invite_enabled = true;

  if v_workspace_id is null then
    raise exception 'invalid_or_disabled_invite'
      using message = '유효하지 않거나 비활성화된 초대 링크입니다.';
  end if;

  -- 이미 참여한 멤버면 재참여 없이 그대로 입장한다(멱등 — 빠른 경로).
  -- 정합성은 아래 on conflict가 보장하므로 이 체크는 프로필 조회를 아끼는 최적화일 뿐이다.
  if exists (
    select 1 from workspace_members
    where workspace_id = v_workspace_id and user_id = v_user_id
  ) then
    return v_workspace_id;
  end if;

  -- 프로필 없는 유저면 여기서 실패(no rows 에러).
  select real_name into strict v_nickname from profiles where id = v_user_id;

  -- 멤버십은 (workspace_id, user_id) 유니크 제약으로 멱등 보장한다.
  -- 동시 참여 요청(중복 클릭/재시도)이 위 exists 체크를 함께 통과하더라도
  -- on conflict do nothing으로 두 번째 insert가 조용히 무시된다(TOCTOU 방지).
  -- 닉네임은 별도 유니크 제약((workspace_id, workspace_nickname))이라, 실명이 기존
  -- 멤버와 충돌하면 unique_violation으로 잡아 짧은 접미사를 붙여 한 번 재시도한다.
  begin
    insert into workspace_members (workspace_id, user_id, workspace_nickname, role)
    values (v_workspace_id, v_user_id, v_nickname, 'member')
    on conflict (workspace_id, user_id) do nothing;
  exception when unique_violation then
    insert into workspace_members (workspace_id, user_id, workspace_nickname, role)
    values (
      v_workspace_id,
      v_user_id,
      v_nickname || '-' || substr(encode(extensions.gen_random_bytes(2), 'hex'), 1, 4),
      'member'
    )
    on conflict (workspace_id, user_id) do nothing;
  end;

  return v_workspace_id;
end;
$$;

revoke all on function public.join_workspace_by_invite_code(text) from public;
grant execute on function public.join_workspace_by_invite_code(text) to authenticated;

-- 초대 미리보기는 비로그인 사용자도 볼 수 있어야 하므로 anon/authenticated에만 명시적으로 부여한다.
revoke all on function public.get_invite_preview(text) from public;
grant execute on function public.get_invite_preview(text) to anon, authenticated;
