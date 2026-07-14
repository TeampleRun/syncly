-- 워크스페이스 자료 파일을 private Storage 버킷에 보관하고 멤버만 접근하도록 제한한다.

insert into storage.buckets (id, name, public, file_size_limit)
values ('workspace-resources', 'workspace-resources', false, 5242880)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit;

drop policy if exists workspace_resources_select_member on storage.objects;
drop policy if exists workspace_resources_insert_member on storage.objects;
drop policy if exists workspace_resources_delete_member on storage.objects;

create policy workspace_resources_select_member
on storage.objects
for select
to authenticated
using (
  bucket_id = 'workspace-resources'
  and private.is_workspace_member(
    case
      when (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
        then (storage.foldername(name))[1]::uuid
      else null
    end
  )
);

create policy workspace_resources_insert_member
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'workspace-resources'
  and private.is_workspace_member(
    case
      when (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
        then (storage.foldername(name))[1]::uuid
      else null
    end
  )
);

create policy workspace_resources_delete_member
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'workspace-resources'
  and private.is_workspace_member(
    case
      when (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
        then (storage.foldername(name))[1]::uuid
      else null
    end
  )
  and (
    owner_id = auth.uid()
    or private.is_workspace_owner(
      case
        when (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
          then (storage.foldername(name))[1]::uuid
        else null
      end
    )
  )
);
