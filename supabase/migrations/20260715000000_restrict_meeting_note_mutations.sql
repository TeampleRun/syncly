-- 회의록은 워크스페이스 멤버가 조회하고, 작성자 또는 소유자만 수정·삭제할 수 있도록 제한한다.
-- 작성 시 author_id는 반드시 본인이어야 한다. (기존의 "멤버면 모든 CRUD" 정책을 대체)

drop policy if exists meeting_notes_member_all on public.meeting_notes;
drop policy if exists meeting_notes_select_member on public.meeting_notes;
drop policy if exists meeting_notes_insert_member on public.meeting_notes;
drop policy if exists meeting_notes_update_author_or_owner on public.meeting_notes;
drop policy if exists meeting_notes_delete_author_or_owner on public.meeting_notes;

create policy meeting_notes_select_member
on public.meeting_notes
for select
to authenticated
using (private.is_workspace_member(workspace_id));

create policy meeting_notes_insert_member
on public.meeting_notes
for insert
to authenticated
with check (
  private.is_workspace_member(workspace_id)
  and author_id = auth.uid()
);

create policy meeting_notes_update_author_or_owner
on public.meeting_notes
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

create policy meeting_notes_delete_author_or_owner
on public.meeting_notes
for delete
to authenticated
using (
  private.is_workspace_member(workspace_id)
  and (
    private.is_workspace_owner(workspace_id)
    or author_id = auth.uid()
  )
);

-- 작성자·워크스페이스·생성일은 수정 API로 변경할 수 없는 감사 메타데이터다.
create or replace function private.prevent_meeting_note_immutable_fields()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if new.workspace_id is distinct from old.workspace_id then
    raise exception '회의록의 워크스페이스는 변경할 수 없습니다.';
  end if;

  if new.author_id is distinct from old.author_id then
    raise exception '회의록의 작성자는 변경할 수 없습니다.';
  end if;

  if new.created_at is distinct from old.created_at then
    raise exception '회의록의 생성일은 변경할 수 없습니다.';
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_meeting_note_immutable_fields on public.meeting_notes;
create trigger prevent_meeting_note_immutable_fields
before update on public.meeting_notes
for each row
execute function private.prevent_meeting_note_immutable_fields();
