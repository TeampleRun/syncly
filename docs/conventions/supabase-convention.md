# Supabase Convention

Syncly의 DB 타입 사용, 쓰기 경로, ENUM, 마이그레이션 규칙을 통일하기 위한 문서입니다.

## 1. DB 타입 시스템

타입은 세 계층으로 관리합니다.

| 파일                                               | 역할                           | 규칙                                                                                         |
| -------------------------------------------------- | ------------------------------ | -------------------------------------------------------------------------------------------- |
| `src/shared/model/database.types.ts`               | Supabase 스키마 자동 생성 타입 | **직접 수정 금지, 직접 import 금지.** `npm run gen:types`로만 갱신                           |
| `src/shared/model/supabase.types.ts`               | Generic 헬퍼 (단일 진입점)     | 자동 생성 타입은 반드시 이 헬퍼를 거쳐 사용                                                  |
| `src/entities/<도메인>/model/<도메인>.db.types.ts` | 도메인별 DB 타입               | 각 도메인 담당자가 자기 엔티티에 생성 (예: `entities/workspace/model/workspace.db.types.ts`) |

스키마가 바뀌면 `npm run gen:types` 한 번으로 모든 도메인 타입이 최신화됩니다.

## 2. Generic 헬퍼 종류와 사용처

| 헬퍼                              | 용도                        | 사용 시점                                |
| --------------------------------- | --------------------------- | ---------------------------------------- |
| `GenericTables<'테이블'>`         | select 결과 Row             | 조회 결과 타입, 매퍼 함수 시그니처       |
| `GenericTablesInsert<'테이블'>`   | insert/upsert 페이로드      | 단일 테이블 쓰기 (default 컬럼은 옵셔널) |
| `GenericTablesUpdate<'테이블'>`   | 부분 수정 페이로드          | 상태 변경 등 patch성 update              |
| `GenericEnums<'enum명'>`          | 네이티브 ENUM 리터럴 유니언 | UI 상수 맵의 키, 폼 값, props 타입       |
| `GenericFunctionArgs<'RPC명'>`    | RPC 인자                    | RPC 호출 래퍼 함수 시그니처              |
| `GenericFunctionReturns<'RPC명'>` | RPC 반환                    | RPC 결과 타입                            |

> supabase-js 클라이언트는 `Database` 제네릭으로 인라인 호출을 이미 추론합니다. 위 헬퍼는 **경계에 이름을 붙일 때** 사용합니다 — 서버액션 파라미터, 매퍼 함수, 컴포넌트 props 등.

## 3. 사용 예시

도메인 타입 정의 (`entities/workspace/model/workspace.db.types.ts` 참고):

```ts
import type { GenericEnums, GenericTables } from '@/shared/model/supabase.types';

export type WorkspaceRow = GenericTables<'workspaces'>;
export type WorkspacePurposeDb = GenericEnums<'workspace_purpose'>;
```

단일 테이블 upsert (대시보드 레이아웃 저장):

```ts
const payload: GenericTablesInsert<'user_dashboard_layouts'> = {
  user_id: userId,
  workspace_id: workspaceId,
  layout: nextLayout,
};
await supabase.from('user_dashboard_layouts').upsert(payload);
```

부분 수정 (칸반 드래그 → 상태 변경):

```ts
const patch: GenericTablesUpdate<'tasks'> = { status: 'in_progress', sort_order: 3 };
await supabase.from('tasks').update(patch).eq('id', taskId);
```

ENUM을 Record 키로 사용 — 값이 추가되면 컴파일 에러로 누락을 잡습니다:

```ts
type TaskStatusDb = GenericEnums<'task_status'>;

const STATUS_LABEL: Record<TaskStatusDb, string> = {
  todo: '대기',
  in_progress: '진행 중',
  done: '완료',
};
```

zod 스키마 재사용 (자동 생성 `Constants` 활용):

```ts
import { Constants } from '@/shared/model/database.types'; // 예외: Constants만 직접 import 허용

const statusSchema = z.enum(Constants.public.Enums.task_status);
```

## 4. 쓰기 경로 규칙

| 상황                                   | 경로                                                              |
| -------------------------------------- | ----------------------------------------------------------------- |
| 여러 테이블을 트랜잭션으로 묶는 쓰기   | **RPC** (예: `create_workspace` — workspaces + members + modules) |
| 단일 테이블 한 방 쓰기 (insert/upsert) | 클라이언트 직접 쿼리 (예: 레이아웃 upsert, 채팅 insert)           |
| 단일 컬럼 부분 수정                    | 클라이언트 직접 update (예: 칸반 상태 변경)                       |
| 집계가 필요한 조회                     | RPC (예: `get_my_workspaces` — count/progress 계산)               |

### auth 연동 전 임시 규칙

- RPC는 `auth.uid()` 대신 **`p_user_id uuid` 파라미터**로 유저를 받습니다. 테스트는 시드 계정 id를 하드코딩합니다.
- auth 연동이 완료되면 `auth.uid()`로 교체하고, `dev_full_access` RLS 정책을 drop해 실 정책을 발동시킵니다.

## 5. ENUM 규칙

- enum성 컬럼은 전부 **Postgres 네이티브 ENUM + snake_case** 값으로 통일합니다.
- 현재 7종: `workspace_purpose`, `task_status`, `task_priority`, `task_category`, `resource_type`, `calendar_event_type`, `member_role`
- 값 추가는 `alter type <enum명> add value '<값>'` 마이그레이션 → `npm run gen:types` 재실행 순서로 진행합니다.
- 프론트에서 enum 값을 문자열 리터럴로 중복 정의하지 않고 `GenericEnums`로 파생합니다.

## 6. 마이그레이션 규칙

- 스키마 변경은 반드시 마이그레이션으로 기록하고, 원격에 적용된 버전과 **동일한 파일명**으로 `supabase/migrations/`에 동기화합니다.
- 스키마 변경 후에는 `npm run gen:types`를 실행해 `database.types.ts` 갱신분을 같은 PR에 포함합니다.

## 7. 테스트 시드

| 항목         | 값                                                                                                                               |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| 계정         | `test1@test.com` ~ `test5@test.com` / `test1234!` (로그인 가능)                                                                  |
| user_id      | `00000000-0000-0000-0000-000000000001` ~ `...0005`                                                                               |
| 워크스페이스 | `...1001` 캡스톤 디자인 팀(team_project) · `...1002` Fitto 앱 개발팀(side_project) · `...1003` 카페 그레이 운영(store_operation) |
| 멤버십       | 5명 전원이 3개 워크스페이스 모두 소속                                                                                            |
| 스프린트     | `...2001` Sprint 1(완료) · `...2002` Sprint 2(진행 중)                                                                           |
