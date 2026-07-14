-- 공지의 조회·작성·수정·삭제·고정 권한을 분리하고 고정 상태 변경을 소유자로 제한한다.
begin;

-- 기존 전체 CRUD/개발용 정책은 다른 permissive 정책과 OR로 결합되므로 공지 테이블에서는 제거한다.
drop policy if exists announcements_member_all on public.announcements;
drop policy if exists dev_full_access on public.announcements;

create policy announcements_select_member
on public.announcements
for select
to authenticated
using (private.is_workspace_member(workspace_id));

create policy announcements_insert_member
on public.announcements
for insert
to authenticated
with check (
  private.is_workspace_member(workspace_id)
  and author_id = auth.uid()
);

create policy announcements_update_author_or_owner
on public.announcements
for update
to authenticated
using (
  private.is_workspace_member(workspace_id)
  and (
    private.is_workspace_owner(workspace_id)
    or author_id = auth.uid()
  )
)
with check (
  private.is_workspace_member(workspace_id)
  and (
    private.is_workspace_owner(workspace_id)
    or author_id = auth.uid()
  )
);

create policy announcements_delete_author_or_owner
on public.announcements
for delete
to authenticated
using (
  private.is_workspace_member(workspace_id)
  and (
    private.is_workspace_owner(workspace_id)
    or author_id = auth.uid()
  )
);

-- INSERT/UPDATE RLS만으로는 고정 상태와 워크스페이스 이동을 구분할 수 없어 트리거에서 막는다.
create or replace function private.prevent_non_owner_announcement_pin()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if tg_op = 'UPDATE' and new.workspace_id is distinct from old.workspace_id then
    raise exception '공지의 워크스페이스는 변경할 수 없습니다.';
  end if;

  if (
    (tg_op = 'INSERT' and new.is_pinned)
    or (tg_op = 'UPDATE' and new.is_pinned is distinct from old.is_pinned)
  ) and not private.is_workspace_owner(new.workspace_id) then
    raise exception '워크스페이스 소유자만 공지를 고정할 수 있습니다.';
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_non_owner_announcement_pin on public.announcements;
create trigger prevent_non_owner_announcement_pin
before insert or update on public.announcements
for each row
execute function private.prevent_non_owner_announcement_pin();

create index if not exists idx_announcements_workspace_pinned_created
on public.announcements (workspace_id, is_pinned desc, created_at desc);

commit;
