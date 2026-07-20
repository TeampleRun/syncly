-- 링크 자료가 사용자가 선택한 제공자 유형을 URL 도메인 추측 없이 보존하도록 한다.
begin;

alter table public.resources
  add column if not exists link_provider text;

alter table public.resources
  drop constraint if exists resources_link_provider_check;

alter table public.resources
  add constraint resources_link_provider_check
  check (link_provider is null or link_provider in ('link', 'notion', 'figma', 'github'));

-- 기존 링크 자료는 URL 호스트로 가능한 범위에서 제공자 값을 채운다.
update public.resources
set link_provider = case
  when url ilike '%github.com%' then 'github'
  when url ilike '%figma.com%' then 'figma'
  when url ilike '%notion.%' then 'notion'
  when url is not null then 'link'
  else null
end
where link_provider is null;

commit;
