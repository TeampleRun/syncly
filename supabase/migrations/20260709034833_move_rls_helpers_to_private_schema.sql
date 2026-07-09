-- Security Advisor 대응: RLS 헬퍼 함수를 API 비노출 스키마로 이동
-- public 스키마의 함수는 PostgREST가 /rest/v1/rpc/로 자동 노출한다.
-- is_workspace_member/is_workspace_owner는 RLS 정책 내부 전용이므로 private 스키마로 옮겨 API 노출을 제거한다.
-- (정책은 함수를 OID로 참조하므로 스키마 이동 후에도 그대로 동작한다)

create schema if not exists private;

alter function public.is_workspace_member(uuid) set schema private;
alter function public.is_workspace_owner(uuid) set schema private;

-- RLS 정책 평가는 쿼리 실행 유저 권한으로 이뤄지므로 authenticated에는 EXECUTE가 필요하다.
grant usage on schema private to authenticated;
grant execute on function private.is_workspace_member(uuid) to authenticated;
grant execute on function private.is_workspace_owner(uuid) to authenticated;

-- anon과 public 롤에서는 실행 권한 제거 (정책상 anon은 이 함수를 평가할 일이 없음)
revoke execute on function private.is_workspace_member(uuid) from anon, public;
revoke execute on function private.is_workspace_owner(uuid) from anon, public;
