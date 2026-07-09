-- 실 RLS 정책 (auth.uid() 기반) — 지금은 dev_full_access와 공존(OR)하므로 무해.
-- auth 연동 완료 시 dev_full_access만 drop하면 이 정책들이 즉시 발동한다.

-- 멤버십 헬퍼 — security definer로 workspace_members 정책의 자기참조 재귀를 회피
create or replace function public.is_workspace_member(p_workspace_id uuid)
returns boolean
language sql stable security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from workspace_members
    where workspace_id = p_workspace_id and user_id = auth.uid()
  );
$$;

create or replace function public.is_workspace_owner(p_workspace_id uuid)
returns boolean
language sql stable security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from workspaces
    where id = p_workspace_id and owner_id = auth.uid()
  );
$$;

-- ===== profiles: 조회는 로그인 유저 전체, 쓰기는 본인만 =====
create policy profiles_select on public.profiles
  for select to authenticated using (true);
create policy profiles_insert_own on public.profiles
  for insert to authenticated with check (id = auth.uid());
create policy profiles_update_own on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- ===== module_registry: 읽기 전용 참조 데이터 =====
create policy module_registry_select on public.module_registry
  for select to authenticated using (true);

-- ===== workspaces: 멤버만 조회, 소유자만 수정/삭제, 생성은 본인 소유로만 =====
create policy workspaces_select_member on public.workspaces
  for select to authenticated using (public.is_workspace_member(id));
create policy workspaces_insert_own on public.workspaces
  for insert to authenticated with check (owner_id = auth.uid());
create policy workspaces_update_owner on public.workspaces
  for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy workspaces_delete_owner on public.workspaces
  for delete to authenticated using (owner_id = auth.uid());

-- ===== workspace_members: 같은 워크스페이스 멤버만 조회, 가입/닉네임변경/탈퇴는 본인 =====
create policy members_select on public.workspace_members
  for select to authenticated using (public.is_workspace_member(workspace_id));
create policy members_insert_self on public.workspace_members
  for insert to authenticated with check (user_id = auth.uid());
create policy members_update_self on public.workspace_members
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy members_delete_self on public.workspace_members
  for delete to authenticated using (user_id = auth.uid());

-- ===== workspace_modules: 멤버 조회, 소유자만 변경 =====
create policy modules_select_member on public.workspace_modules
  for select to authenticated using (public.is_workspace_member(workspace_id));
create policy modules_write_owner on public.workspace_modules
  for insert to authenticated with check (public.is_workspace_owner(workspace_id));
create policy modules_update_owner on public.workspace_modules
  for update to authenticated using (public.is_workspace_owner(workspace_id)) with check (public.is_workspace_owner(workspace_id));
create policy modules_delete_owner on public.workspace_modules
  for delete to authenticated using (public.is_workspace_owner(workspace_id));

-- ===== user_dashboard_layouts: 본인 것만 (개인별 레이아웃) =====
create policy layouts_own on public.user_dashboard_layouts
  for all to authenticated
  using (user_id = auth.uid() and public.is_workspace_member(workspace_id))
  with check (user_id = auth.uid() and public.is_workspace_member(workspace_id));

-- ===== 워크스페이스 콘텐츠 테이블: 멤버면 CRUD 가능 =====
-- (작성자 본인만 수정 같은 세밀한 규칙은 추후 필요 시 강화)
do $$
declare t text;
begin
  foreach t in array array[
    'sprints','tasks','calendar_events','announcements',
    'meeting_notes','resources','chat_messages','work_schedule_entries'
  ] loop
    execute format(
      'create policy %I on public.%I for all to authenticated using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id))',
      t || '_member_all', t
    );
  end loop;
end $$;
