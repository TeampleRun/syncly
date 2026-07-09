-- create_workspace 방어 분기 추가 (CodeRabbit 리뷰 반영)
-- workspace_purpose enum이 확장됐는데 모듈 매핑을 갱신하지 않으면
-- 기존에는 조용히 모듈 0개짜리 워크스페이스가 생성됐다 → 이제는 즉시 실패시켜 회귀를 조기 발견한다.
create or replace function public.create_workspace(
  p_user_id uuid,
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
  v_nickname text;
  v_modules text[];
begin
  -- 프로필 없는 유저면 여기서 실패 (no rows 에러)
  select real_name into strict v_nickname from profiles where id = p_user_id;

  v_modules := case p_purpose
    when 'team_project' then
      array['dashboard','project_board','calendar','announcements','meeting_notes','resources','chat']
    when 'side_project' then
      array['dashboard','sprint_board','calendar','announcements','meeting_notes','resources','chat']
    when 'store_operation' then
      array['dashboard','work_schedule','calendar','announcements','resources','chat']
  end;

  -- enum 값 추가 시 매핑 누락을 조용한 실패 대신 즉시 에러로 노출
  if v_modules is null then
    raise exception 'create_workspace: purpose %에 대한 기본 모듈 매핑이 없습니다', p_purpose;
  end if;

  -- invite_code는 unique 제약이 있어 동시 생성 충돌 시 재시도한다 (예측 불가 랜덤 hex 16자)
  for i in 1..3 loop
    begin
      insert into workspaces (owner_id, name, description, purpose, invite_code)
      values (
        p_user_id,
        p_name,
        p_description,
        p_purpose,
        encode(extensions.gen_random_bytes(8), 'hex')
      )
      returning workspaces.id into v_workspace_id;
      exit;
    exception when unique_violation then
      if i = 3 then
        raise;
      end if;
    end;
  end loop;

  insert into workspace_members (workspace_id, user_id, workspace_nickname, role)
  values (v_workspace_id, p_user_id, v_nickname, 'owner');

  -- purpose별 기본 모듈 활성화 (module_registry의 활성 모듈만)
  insert into workspace_modules (workspace_id, module_type, sort_order)
  select v_workspace_id, t.module_type, (t.ord - 1)::int
  from unnest(v_modules) with ordinality as t(module_type, ord)
  join module_registry mr on mr.type = t.module_type and mr.is_active;

  return v_workspace_id;
end;
$$;
