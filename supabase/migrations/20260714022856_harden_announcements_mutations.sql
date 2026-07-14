-- 이미 공지 권한 마이그레이션이 적용된 환경에도 고정 상태와 워크스페이스 이동 제한을 반영한다.
begin;

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

commit;
