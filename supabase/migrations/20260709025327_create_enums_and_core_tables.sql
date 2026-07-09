-- Syncly 초기 스키마 — ERD 확정본 (2026-07-09)
-- enum은 팀 방침대로 전부 Postgres 네이티브 ENUM

create extension if not exists moddatetime schema extensions;

-- ===== ENUM 타입 =====
create type workspace_purpose as enum ('team_project', 'side_project', 'store_operation');
create type task_status as enum ('todo', 'in_progress', 'done');
create type task_priority as enum ('high', 'medium', 'low');
create type task_category as enum ('design', 'frontend', 'backend', 'planning');
create type resource_type as enum ('file', 'link');
create type calendar_event_type as enum ('meeting', 'deadline');
create type member_role as enum ('owner', 'member');

-- ===== 테이블 =====

-- PROFILES.id = auth.users.id (auth.uid() 통합 결정)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  real_name text not null,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.module_registry (
  type text primary key,
  display_name text not null,
  description text,
  is_active boolean not null default true,
  default_settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id),
  name text not null,
  description text,
  purpose workspace_purpose not null,
  invite_code text unique,
  invite_enabled boolean not null default false,
  setup_status text not null default 'completed',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  workspace_nickname text not null,
  role member_role not null default 'member',
  joined_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, user_id)
);

create table public.workspace_modules (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  module_type text not null references public.module_registry(type),
  is_enabled boolean not null default true,
  sort_order int not null default 0,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, module_type)
);

-- 대시보드 레이아웃: 개인별 저장, (user_id, workspace_id) 복합 PK — page_type 없음(확정)
create table public.user_dashboard_layouts (
  user_id uuid not null references public.profiles(id) on delete cascade,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  layout jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, workspace_id)
);

-- 신규: 스프린트 (PR #27 모델 기준 — 포인트 합계/남은 일수는 집계로 파생)
create table public.sprints (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  start_date date not null,
  end_date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- sprint_id null = 백로그 (별도 백로그 테이블 없음 — PR #27 확정 구조)
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  sprint_id uuid references public.sprints(id) on delete set null,
  assignee_id uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  title text not null,
  description text,
  status task_status not null default 'todo',
  priority task_priority not null default 'medium',
  category task_category,
  point int,
  due_date date,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  task_id uuid references public.tasks(id) on delete set null,
  title text not null,
  description text,
  event_type calendar_event_type not null default 'meeting',
  starts_at timestamptz not null,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  title text not null,
  content text not null,
  is_pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- participants/decisions/follow_up_actions: 회의록 페이지(PR #24)가 쓰는 구조화 필드
create table public.meeting_notes (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  title text not null,
  content text,
  meeting_at timestamptz not null,
  participants uuid[] not null default '{}',
  decisions text[] not null default '{}',
  follow_up_actions text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.resources (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  uploaded_by uuid references public.profiles(id) on delete set null,
  title text not null,
  description text,
  resource_type resource_type not null,
  url text,
  storage_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete set null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 방식(날짜 vs 요일)은 회의 예정 — 일단 ERD(work_date)대로. 뒤집히면 ALTER 1회
create table public.work_schedule_entries (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  work_date date not null,
  shift_type text not null,
  note text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, user_id, work_date)
);

-- ===== 인덱스 (FK 조회 경로) =====
create index idx_workspace_members_workspace on public.workspace_members (workspace_id);
create index idx_workspace_members_user on public.workspace_members (user_id);
create index idx_workspace_modules_workspace on public.workspace_modules (workspace_id);
create index idx_sprints_workspace on public.sprints (workspace_id);
create index idx_tasks_workspace on public.tasks (workspace_id);
create index idx_tasks_sprint on public.tasks (sprint_id);
create index idx_tasks_assignee on public.tasks (assignee_id);
create index idx_calendar_events_workspace_starts on public.calendar_events (workspace_id, starts_at);
create index idx_announcements_workspace on public.announcements (workspace_id);
create index idx_meeting_notes_workspace on public.meeting_notes (workspace_id);
create index idx_resources_workspace on public.resources (workspace_id);
create index idx_chat_messages_workspace_created on public.chat_messages (workspace_id, created_at);
create index idx_work_schedule_workspace_date on public.work_schedule_entries (workspace_id, work_date);

-- ===== updated_at 자동 갱신 + 임시 RLS =====
-- RLS: auth 연동 전까지 permissive(전체 허용). 로그인 붙으면 auth.uid() 기반 정책으로 교체 (TODO)
do $$
declare t text;
begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    execute format('create trigger set_updated_at before update on public.%I for each row execute procedure extensions.moddatetime(updated_at)', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy dev_full_access on public.%I for all using (true) with check (true)', t);
  end loop;
end $$;
