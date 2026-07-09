-- 설계 점검 확정 제약 (2026-07-09, 지호님 승인)
-- sprints(workspace_id, name) unique는 제외 — 스프린트를 미리 여러 개 만들어두는 워크플로우 허용

-- 1) 같은 워크스페이스 안 닉네임 중복 방지 (ERD 문서 권장)
alter table public.workspace_members
  add constraint workspace_members_nickname_unique unique (workspace_id, workspace_nickname);

-- 2) 레이아웃은 실제 멤버만 소유 가능 — 멤버 탈퇴 시 레이아웃도 삭제 (ERD 문서 권장)
alter table public.user_dashboard_layouts
  add constraint user_dashboard_layouts_member_fk
  foreign key (workspace_id, user_id)
  references public.workspace_members (workspace_id, user_id) on delete cascade;

-- 3) 근무 배정 대상은 실제 멤버만 — 멤버 탈퇴 시 근무 기록도 삭제 (ERD 문서 권장)
alter table public.work_schedule_entries
  add constraint work_schedule_entries_member_fk
  foreign key (workspace_id, user_id)
  references public.workspace_members (workspace_id, user_id) on delete cascade;

-- 4) 이메일 중복 방어 (auth.users와 별개의 방어선)
alter table public.profiles
  add constraint profiles_email_unique unique (email);

-- 5~7) 값 검증 (ERD 문서의 "시간 범위 검증 필요" 반영)
alter table public.sprints
  add constraint sprints_date_range_check check (end_date >= start_date);

alter table public.calendar_events
  add constraint calendar_events_time_range_check check (ends_at is null or ends_at >= starts_at);

alter table public.tasks
  add constraint tasks_point_check check (point is null or point >= 0);
