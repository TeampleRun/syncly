-- 워크스페이스 생성자는 RPC 인자가 아닌 인증 세션(auth.uid())으로 결정한다.
-- 기존 p_user_id 인자를 제거해 호출자가 다른 사용자를 생성자로 지정할 수 없게 한다.
begin;

drop function if exists public.create_workspace(uuid, text, workspace_purpose, text);

create function public.create_workspace(
  p_name text,
  p_purpose workspace_purpose,
  p_description text default null
)
returns uuid
language plpgsql
set search_path = public, pg_temp
as $$
declare
  v_workspace_id uuid;
  v_user_id uuid := auth.uid();
  v_nickname text;
  v_modules text[];
begin
  if v_user_id is null then
    raise exception '인증된 사용자만 워크스페이스를 만들 수 있습니다.'
      using errcode = '28000';
  end if;

  -- OAuth 콜백에서 profiles upsert가 완료된 인증 사용자만 생성할 수 있다.
  select real_name into strict v_nickname from profiles where id = v_user_id;

  v_modules := case p_purpose
    when 'team_project' then
      array['dashboard','project_board','calendar','announcements','meeting_notes','resources','chat']
    when 'side_project' then
      array['dashboard','sprint_board','calendar','announcements','meeting_notes','resources','chat']
    when 'store_operation' then
      array['dashboard','work_schedule','calendar','announcements','resources','chat']
  end;

  if v_modules is null then
    raise exception 'create_workspace: purpose %에 대한 기본 모듈 매핑이 없습니다', p_purpose;
  end if;

  -- invite_code unique 충돌 시 최대 세 번 재시도한다.
  for i in 1..3 loop
    begin
      insert into workspaces (owner_id, name, description, purpose, invite_code)
      values (
        v_user_id,
        p_name,
        p_description,
        p_purpose,
        encode(extensions.gen_random_bytes(8), 'hex')
      )
      returning id into v_workspace_id;
      exit;
    exception when unique_violation then
      if i = 3 then
        raise;
      end if;
    end;
  end loop;

  insert into workspace_members (workspace_id, user_id, workspace_nickname, role)
  values (v_workspace_id, v_user_id, v_nickname, 'owner');

  insert into workspace_modules (workspace_id, module_type, sort_order)
  select v_workspace_id, t.module_type, (t.ord - 1)::int
  from unnest(v_modules) with ordinality as t(module_type, ord)
  join module_registry mr on mr.type = t.module_type and mr.is_active;

  return v_workspace_id;
end;
$$;

revoke all on function public.create_workspace(text, workspace_purpose, text) from public;
grant execute on function public.create_workspace(text, workspace_purpose, text) to authenticated;

commit;
