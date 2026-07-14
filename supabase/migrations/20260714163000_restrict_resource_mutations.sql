-- 자료실은 다른 도메인에서도 공유하므로 테이블을 분리하지 않고,
-- 워크스페이스 멤버 조회·업로더 또는 소유자의 수정/삭제 규칙만 적용한다.

drop policy if exists resources_member_all on public.resources;
drop policy if exists resources_select_member on public.resources;
drop policy if exists resources_insert_member on public.resources;
drop policy if exists resources_update_uploader_or_owner on public.resources;
drop policy if exists resources_delete_uploader_or_owner on public.resources;

create policy resources_select_member
on public.resources
for select
to authenticated
using (private.is_workspace_member(workspace_id));

create policy resources_insert_member
on public.resources
for insert
to authenticated
with check (
  private.is_workspace_member(workspace_id)
  and uploaded_by = auth.uid()
);

create policy resources_update_uploader_or_owner
on public.resources
for update
to authenticated
using (
  private.is_workspace_member(workspace_id)
  and (
    private.is_workspace_owner(workspace_id)
    or uploaded_by = auth.uid()
  )
)
with check (
  private.is_workspace_member(workspace_id)
  and (
    private.is_workspace_owner(workspace_id)
    or uploaded_by = auth.uid()
  )
);

create policy resources_delete_uploader_or_owner
on public.resources
for delete
to authenticated
using (
  private.is_workspace_member(workspace_id)
  and (
    private.is_workspace_owner(workspace_id)
    or uploaded_by = auth.uid()
  )
);

-- 작성자·워크스페이스·생성일은 수정 API로 변경할 수 없는 감사 메타데이터다.
create or replace function private.prevent_resource_immutable_fields()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if new.workspace_id is distinct from old.workspace_id then
    raise exception '자료의 워크스페이스는 변경할 수 없습니다.';
  end if;

  if new.uploaded_by is distinct from old.uploaded_by then
    raise exception '자료의 업로더는 변경할 수 없습니다.';
  end if;

  if new.created_at is distinct from old.created_at then
    raise exception '자료의 생성일은 변경할 수 없습니다.';
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_resource_immutable_fields on public.resources;
create trigger prevent_resource_immutable_fields
before update on public.resources
for each row
execute function private.prevent_resource_immutable_fields();
