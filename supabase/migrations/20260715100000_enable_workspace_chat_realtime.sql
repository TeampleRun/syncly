-- 워크스페이스 채팅은 멤버 조회와 본인 발송만 허용하고 INSERT 이벤트를 Realtime으로 전파한다.

drop policy if exists chat_messages_member_all on public.chat_messages;
drop policy if exists chat_messages_select_member on public.chat_messages;
drop policy if exists chat_messages_insert_sender on public.chat_messages;

create policy chat_messages_select_member
on public.chat_messages
for select
to authenticated
using (private.is_workspace_member(workspace_id));

create policy chat_messages_insert_sender
on public.chat_messages
for insert
to authenticated
with check (
  private.is_workspace_member(workspace_id)
  and sender_id = auth.uid()
);

-- 이미 publication에 포함된 환경에서도 안전하게 마이그레이션을 다시 실행한다.
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'chat_messages'
  ) then
    alter publication supabase_realtime add table public.chat_messages;
  end if;
end;
$$;
