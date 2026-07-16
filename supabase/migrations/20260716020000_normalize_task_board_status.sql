-- UI 상태값(in-progress)을 DB enum 값(in_progress)으로 정규화해 보드 정렬 RPC의 계약을 보완한다.

create or replace function public.update_task_board(
  p_workspace_id uuid,
  p_tasks jsonb
)
returns void
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  v_payload_count int;
  v_updated_count int;
begin
  if auth.uid() is null then
    raise exception '인증된 사용자만 업무 보드를 수정할 수 있습니다.'
      using errcode = '28000';
  end if;

  if not private.is_workspace_member(p_workspace_id) then
    raise exception '워크스페이스 멤버만 업무 보드를 수정할 수 있습니다.'
      using errcode = '42501';
  end if;

  v_payload_count := jsonb_array_length(p_tasks);

  if v_payload_count = 0 then
    return;
  end if;

  with payload as (
    select
      (item->>'id')::uuid as id,
      replace(item->>'status', '-', '_')::task_status as status,
      (item->>'sortOrder')::int as sort_order
    from jsonb_array_elements(p_tasks) as item
  )
  update public.tasks as task
  set
    status = payload.status,
    sort_order = payload.sort_order
  from payload
  where task.workspace_id = p_workspace_id
    and task.id = payload.id;

  get diagnostics v_updated_count = row_count;

  if v_updated_count <> v_payload_count then
    raise exception 'task board update payload mismatch: expected %, updated %', v_payload_count, v_updated_count;
  end if;
end;
$$;

revoke all on function public.update_task_board(uuid, jsonb) from public;
grant execute on function public.update_task_board(uuid, jsonb) to authenticated;
