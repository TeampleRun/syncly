# Security Convention

Syncly의 인증, 권한, API 보안 기준을 통일하기 위한 문서입니다.

## 1. 기본 원칙

- 인증 여부는 클라이언트가 아니라 서버에서 확인합니다.
- 워크스페이스 데이터 접근은 `workspace_members`를 기준으로 판단합니다.
- 관리자 기능은 `workspace_members.role`을 기준으로 권한을 확인합니다.
- RLS 정책에서 `workspace_members`를 직접 재귀 조회하지 않고 Security Definer 함수를 사용합니다.
- Supabase `service_role` 또는 secret key는 클라이언트에 노출하지 않습니다.
- 상태 변경 요청은 명확한 HTTP method 또는 Server Action을 사용합니다.

## 2. ERD Security Baseline

보안 정책과 서버 권한 검증은 아래 최신 ERD 기준을 전제로 합니다.

### Workspace

- `workspaces.invite_code`는 `unique` constraint를 갖습니다.
- 초대 코드는 워크스페이스 참여용 식별자이므로 예측하기 어렵게 생성합니다.
- 초대 코드 조회 후 실제 참여 처리에서는 서버에서 인증 사용자와 대상 워크스페이스 상태를 다시 확인합니다.

### Profile / Member

- 사용자 실명은 `profiles.real_name`을 사용합니다.
- 워크스페이스 안에서 노출되는 이름은 `workspace_members.workspace_nickname`을 사용합니다.
- `workspace_members`는 soft delete하지 않습니다.
- `workspace_members`에는 `status`, `deleted_at`을 두지 않습니다.
- 멤버 내보내기, 탈퇴, 제거는 `workspace_members` row를 hard delete합니다.
- `workspace_members`는 `unique(workspace_id, user_id)`를 갖습니다.
- `workspace_members`는 `unique(workspace_id, workspace_nickname)`을 갖습니다.
- 멤버 권한 검증은 항상 `workspace_id`, `user_id`, `role`을 함께 확인합니다.

### User-Scoped Workspace Data

- `workspace_layouts`는 `user_id`를 포함하고 사용자별 레이아웃을 저장합니다.
- `workspace_layouts`는 `FK(workspace_id, user_id) -> workspace_members(workspace_id, user_id)`를 사용합니다.
- `work_schedule_entries`는 `FK(workspace_id, user_id) -> workspace_members(workspace_id, user_id)`를 사용합니다.
- 사용자별 워크스페이스 데이터 생성 시 서버와 DB 양쪽에서 해당 사용자가 워크스페이스 멤버인지 보장합니다.

### Removed Schema

- `workspace_templates`, `template_modules`, `template_default_items`는 사용하지 않습니다.
- `module_registry.icon_name`은 사용하지 않습니다.
- 모듈 아이콘은 DB가 아니라 프론트엔드 상수에서 관리합니다.

## 3. CSRF Protection

쿠키 기반 인증을 사용하는 요청에서는 CSRF 공격 가능성을 고려합니다.

CSRF는 사용자가 로그인된 상태를 악용해, 의도하지 않은 상태 변경 요청을 보내게 만드는 공격입니다.
따라서 로그인 이후 서버 데이터를 변경하는 요청은 인증 여부뿐 아니라 요청 출처와 사용자 권한을 함께 확인해야 합니다.

### 적용 대상

아래와 같이 서버 상태를 변경하는 모든 요청에 적용합니다.

- 워크스페이스 생성 / 수정 / 삭제
- 워크스페이스 모듈 추가 / 제거 / 정렬 변경
- 멤버 초대 / 권한 변경 / 내보내기
- 공지 생성 / 수정 / 삭제
- 업무 생성 / 수정 / 삭제
- 일정 생성 / 수정 / 삭제
- 회의록 생성 / 수정 / 삭제
- 자료 생성 / 수정 / 삭제
- 채팅 메시지 전송 / 삭제

### 운영 규칙

- 상태 변경 요청은 `GET`으로 처리하지 않습니다.
- 상태 변경 요청은 `POST`, `PATCH`, `PUT`, `DELETE` 중 적절한 메서드를 사용합니다.
- 서버 액션 또는 API Route에서 인증된 사용자만 처리합니다.
- 요청 사용자가 해당 `workspace`의 멤버인지 확인합니다.
- 관리자 기능은 `workspace_members.role`을 기준으로 권한을 확인합니다.
- 멤버 제거는 soft delete가 아니라 hard delete로 처리합니다.
- invite code 기반 참여 요청은 서버에서 `invite_code` 조회 후 멤버 중복 여부를 확인합니다.
- 외부 origin에서 들어오는 상태 변경 요청은 차단합니다.
- 인증/권한 검증은 클라이언트가 아니라 서버에서 수행합니다.

### 잘못된 예시

```txt
GET /api/workspaces/delete?id=workspace-id
```

GET 요청으로 상태를 변경하면 안 됩니다.

### 권장 예시

```txt
DELETE /api/workspaces/:workspaceId
```

서버에서는 다음 조건을 확인합니다.

```txt
1. 로그인한 유저인가?
2. 해당 workspace의 member인가?
3. 필요한 경우 admin 또는 owner 권한이 있는가?
4. 허용된 origin에서 온 요청인가?
```

## 4. Workspace Authorization

워크스페이스 하위 데이터는 반드시 `workspace_id`를 기준으로 격리합니다.

권한 확인 기준:

```txt
profiles.id = auth.users.id
workspace_members.user_id = profiles.id
workspace_members.workspace_id = 요청 대상 workspace_id
```

운영 규칙:

- 워크스페이스 멤버만 해당 워크스페이스 데이터를 조회할 수 있습니다.
- 워크스페이스 멤버만 해당 워크스페이스 데이터를 생성할 수 있습니다.
- 작성자 또는 관리자만 수정/삭제할 수 있는 리소스는 서버에서 별도 검증합니다.
- 관리자 기능은 `owner` 또는 `admin` role만 허용합니다.
- 멤버 제거, 역할 변경, 초대 코드 재발급 같은 관리성 작업은 `owner` 또는 `admin`만 허용합니다.
- `owner` 권한 양도 또는 마지막 `owner` 제거 가능성은 서버에서 별도 방지합니다.

## 5. RLS Policy Convention

RLS는 서버 검증을 대체하지 않고 DB 레벨의 마지막 방어선으로 사용합니다.

### 기본 규칙

- 모든 워크스페이스 하위 테이블은 `workspace_id` 기준으로 격리합니다.
- 사용자별 데이터는 가능한 경우 `user_id`도 함께 저장하고 검증합니다.
- `workspace_members`를 참조하는 RLS 정책은 재귀 조회를 피합니다.
- `workspace_members` 멤버십 확인은 Security Definer 함수로 감쌉니다.
- Security Definer 함수는 `search_path`를 고정하고 필요한 최소 컬럼만 조회합니다.
- RLS 정책에는 복잡한 비즈니스 규칙을 과도하게 넣지 않고, 서버 코드에서 명시적으로 검증합니다.

### 권장 함수 형태

```sql
create or replace function public.is_workspace_member(target_workspace_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = target_workspace_id
      and wm.user_id = auth.uid()
  );
$$;
```

관리자 권한이 필요한 정책은 별도 함수로 role을 검증합니다.

```sql
create or replace function public.is_workspace_admin(target_workspace_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = target_workspace_id
      and wm.user_id = auth.uid()
      and wm.role in ('owner', 'admin')
  );
$$;
```

### `workspace_members` 정책 주의사항

- `workspace_members` 정책 안에서 `workspace_members`를 직접 다시 조회하지 않습니다.
- 본인 멤버십 조회, 관리자 멤버 관리, 초대 코드 참여 같은 경로를 분리합니다.
- 멤버 삭제는 hard delete이므로 삭제 전 서버에서 권한과 마지막 `owner` 여부를 확인합니다.

## 6. Invite Code Convention

초대 코드는 편의 기능이지만 권한 검증을 생략하는 인증 수단이 아닙니다.

운영 규칙:

- `workspaces.invite_code`는 DB unique constraint로 중복을 방지합니다.
- 초대 코드 생성 시 충돌이 발생하면 서버에서 새 코드를 재생성합니다.
- 초대 코드로 참여할 때도 로그인 사용자인지 확인합니다.
- 참여 처리 전 `workspace_members`의 `unique(workspace_id, user_id)` 중복을 확인합니다.
- 참여 처리 전 `workspace_members`의 `unique(workspace_id, workspace_nickname)` 충돌을 확인합니다.
- 초대 코드 재발급은 `owner` 또는 `admin`만 허용합니다.

## 7. Hard Delete Convention

`workspace_members`는 멤버십의 현재 상태만 표현합니다.

운영 규칙:

- 멤버 제거는 `workspace_members` row 삭제로 처리합니다.
- `status`, `deleted_at` 기반의 탈퇴/비활성 상태를 구현하지 않습니다.
- 멤버 제거 전 해당 사용자의 `workspace_layouts`, `work_schedule_entries` 등 복합 FK 연결 데이터를 고려합니다.
- 멤버 제거 후에도 보존해야 하는 업무, 회의록, 자료 같은 작성 이력은 각 리소스의 작성자 정책으로 별도 설계합니다.
- 감사 로그가 필요하면 `workspace_members`에 soft delete 컬럼을 추가하지 않고 별도 audit table을 둡니다.

## 8. PR Security Checklist

보안 관련 기능이 포함된 PR은 아래 항목을 확인합니다.

- [ ] 상태 변경 요청에 `GET`을 사용하지 않았습니다.
- [ ] 서버에서 로그인 여부를 확인했습니다.
- [ ] 요청 사용자의 workspace member 권한을 확인했습니다.
- [ ] 관리자 기능은 role 검증을 추가했습니다.
- [ ] RLS에서 `workspace_members` 재귀 조회를 만들지 않았습니다.
- [ ] 멤버십 확인 RLS는 Security Definer 함수를 사용했습니다.
- [ ] `workspace_members` 제거는 hard delete 기준으로 처리했습니다.
- [ ] `invite_code` 흐름에서 unique constraint, 중복 참여, 닉네임 충돌을 고려했습니다.
- [ ] 사용자별 워크스페이스 데이터는 `(workspace_id, user_id)` 멤버십을 검증했습니다.
- [ ] 외부 origin 요청 가능성을 고려했습니다.
- [ ] 클라이언트에 secret key를 노출하지 않았습니다.
