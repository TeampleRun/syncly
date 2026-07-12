-- sprint 도메인 RPC
-- 공통: auth 연동 전이므로 p_workspace_id 파라미터로 스코프를 받는다 (연동 후 멤버십 검증은 RLS/auth.uid()에 위임)

-- 워크스페이스의 스프린트 목록 — 카드/벨로시티에 필요한 집계를 단일 쿼리로 반환 (스프린트 수와 무관하게 쿼리 1회, N+1 없음)
-- 파생값은 tasks에서 집계하며 sprints 테이블에 저장하지 않는다:
--   total_points/completed_points = 해당 스프린트 tasks의 point 합(완료는 status='done' 필터)
--   days_left = 마감일까지 남은 일수(지난 스프린트는 0)
create or replace function public.get_sprints(p_workspace_id uuid)
returns table (
  id uuid,
  workspace_id uuid,
  name text,
  start_date date,
  end_date date,
  total_points int,
  completed_points int,
  days_left int
)
language sql
stable
set search_path = public, pg_temp
as $$
  select
    s.id,
    s.workspace_id,
    s.name,
    s.start_date,
    s.end_date,
    p.total_points,
    p.completed_points,
    greatest(0, (s.end_date - current_date))::int as days_left
  from sprints s
  cross join lateral (
    select
      coalesce(sum(t.point), 0)::int as total_points,
      coalesce(sum(t.point) filter (where t.status = 'done'), 0)::int as completed_points
    from tasks t
    where t.sprint_id = s.id
  ) p
  where s.workspace_id = p_workspace_id
  order by s.start_date;
$$;
