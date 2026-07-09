-- 워크스페이스 도메인 RPC 2종
-- 공통: auth 연동 전이므로 p_user_id 파라미터로 유저를 받는다 (연동 후 auth.uid()로 교체 예정)

-- 내 워크스페이스 목록 — 카드에 필요한 집계를 단일 쿼리로 반환 (워크스페이스 수와 무관하게 쿼리 1회, N+1 없음)
create or replace function public.get_my_workspaces(p_user_id uuid)
returns table (
  id uuid,
  name text,
  purpose workspace_purpose,
  member_count int,
  task_count int,
  done_task_count int,
  progress int,
  updated_at timestamptz
)
language sql
stable
set search_path = public, pg_temp
as $$
  select
    w.id,
    w.name,
    w.purpose,
    m.member_count,
    t.task_count,
    t.done_task_count,
    coalesce(round(t.done_task_count::numeric / nullif(t.task_count, 0) * 100), 0)::int as progress,
    w.updated_at
  from workspaces w
  join workspace_members me
    on me.workspace_id = w.id and me.user_id = p_user_id
  cross join lateral (
    select count(*)::int as member_count
    from workspace_members wm
    where wm.workspace_id = w.id
  ) m
  cross join lateral (
    select
      count(*)::int as task_count,
      (count(*) filter (where ts.status = 'done'))::int as done_task_count
    from tasks ts
    where ts.workspace_id = w.id
  ) t
  order by w.updated_at desc;
$$;

-- 워크스페이스 생성 — workspaces + owner 멤버십 + purpose별 기본 모듈을 한 트랜잭션으로 생성
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
begin
  -- 프로필 없는 유저면 여기서 실패 (no rows 에러)
  select real_name into strict v_nickname from profiles where id = p_user_id;

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
  from unnest(
    case p_purpose
      when 'team_project' then
        array['dashboard','project_board','calendar','announcements','meeting_notes','resources','chat']
      when 'side_project' then
        array['dashboard','sprint_board','calendar','announcements','meeting_notes','resources','chat']
      when 'store_operation' then
        array['dashboard','work_schedule','calendar','announcements','resources','chat']
    end
  ) with ordinality as t(module_type, ord)
  join module_registry mr on mr.type = t.module_type and mr.is_active;

  return v_workspace_id;
end;
$$;
