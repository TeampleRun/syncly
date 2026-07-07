# feat(dashboard): 템플릿 공용 대시보드

## 개요

워크스페이스 용도(purpose)에 따라 위젯 구성이 달라지는 **공용 대시보드**입니다.
하나의 엔진이 모든 템플릿을 렌더하고, 팀원은 **"어떤 위젯을, 어느 템플릿에"** 만 선언하면 됩니다.

- 라우트: `/workspaces/[workspaceId]/dashboard` (템플릿은 URL이 아니라 워크스페이스의 `purpose`가 결정)
- 위젯은 **단일 카탈로그**로 관리하고 `WidgetId`를 타입으로 파생 → 존재하지 않는 위젯 id는 컴파일 차단
- 위젯 **id로 데이터(위치)와 UI(렌더)를 분리** → DB엔 개인별 위치만, 위젯 설정은 코드가 소유
- 레이아웃은 유저별로 조회/저장 (`WORKSPACE_LAYOUTS`)

## 핵심 설계 — 위젯 id로 데이터/UI 분리

같은 **위젯 id**를 키로, 서로 모르는 두 관심사를 렌더 시점에 조인합니다.

```
저장 데이터            id            카탈로그(코드)
{ i:'my-tasks',  ──▶ 'my-tasks' ◀── { render:<MyTasks/>, minW, minH, title }
  x, y, w, h }
   "어디에"                              "어떻게"
        \______________ id로 매칭 ______________/
```

| 관심사 | 소유 | 저장(DB) |
|---|---|---|
| 렌더 + 제약(minW/minH) + 기본배치 + 표시명 | `WIDGET_CATALOG` (코드) | ❌ |
| 위치 (i, x, y, w, h) | 유저 | ✅ `WORKSPACE_LAYOUTS.layout` jsonb |
| 템플릿별 추가 가능 위젯 | `TEMPLATE_WIDGETS` (코드) | ❌ |

- **DB엔 컴포넌트를 저장할 수 없으므로** id(위치)만 저장하고, 렌더러·제약은 카탈로그가 단일 소유.
- 저장은 위치만(`i,x,y,w,h`), 제약은 렌더 시 카탈로그에서 머지 → 카탈로그에서 제약을 바꾸면 기존 유저에게도 반영되고, DB에 위젯 설정이 중복 저장되지 않음.

## 구성

```
shared/dashboard/
  lib/widget-size.ts            WidgetSize, getWidgetSize
  model/template.ts             WorkspacePurpose
  model/widget.ts               WidgetDefinition (layout + title + render)
  ui/widget-card.tsx            위젯 공용 UI
  ui/stat-card.tsx

entities/dashboard-layout/
  model/dashboard-layout.types.ts   DashboardLayoutState { layout }
  api/get-dashboard-layout.ts       getDashboardLayout   (조회)
  api/save-dashboard-layout.ts      saveDashboardLayout  (저장, 'use server')

features/dashboard/edit-layout/
  model/useDashboardLayout.ts       배치 상태 + 추가/삭제 + 영속화(위치만)
  ui/EditModeBanner.tsx, ui/DashboardEditToggle.tsx

views/dashboard/
  config/widget-catalog.tsx         WIDGET_CATALOG(id 키) + WidgetId 파생
  config/template-widgets.ts        TEMPLATE_WIDGETS: purpose → WidgetId[]
  ui/DashboardView.tsx              엔진: purpose로 스코프 + id 조인 렌더
  ui/DashboardGrid.tsx, ui/AddWidgetBar.tsx

app/workspaces/[workspaceId]/dashboard/page.tsx   purpose 조회 → DashboardView
```

데이터 흐름:
```
page(RSC): purpose = getWorkspace(workspaceId).purpose
  → <DashboardView purpose workspaceId />
       ├ useDashboardLayout(workspaceId, pageType)   # 레이아웃 조회/저장 (user_id + workspace_id 기준)
       ├ TEMPLATE_WIDGETS[purpose]                    # 이 템플릿이 허용하는 위젯 (추가 메뉴 스코프)
       └ WIDGET_CATALOG[id]                           # id로 렌더 조인
```

## 동작

- 대시보드는 **빈 상태로 시작**하고, 편집 모드에서 템플릿이 허용하는 위젯을 추가해 구성.
- 배치(드래그/리사이즈)·추가/삭제는 유저별로 저장되어 다음 방문 때 복원.
- 위젯 크기에 따라 sm/md/lg 밀도 변형 렌더(`getWidgetSize`).

## 팀원 사용 가이드

건드리는 파일은 **카탈로그 + 템플릿 목록**이 중심. 엔진/훅/영속화는 수정 불필요.

**① 기존 템플릿의 위젯 구성 변경** — `template-widgets.ts`의 해당 `purpose` 배열만 수정.

**② 새 위젯 추가** (데이터 → 위젯 → 등록 순서)
1. **데이터 엔티티 생성** — `entities/<슬라이스>/<이름>/`
   - `model/<이름>.ts` : 타입 + mock 데이터(추후 API/DB로 교체)
   - `index.ts` : Public API로 export
2. **위젯 컴포넌트 생성** — `widgets/<슬라이스>/dashboard-<이름>/`
   - `@/entities/<슬라이스>/<이름>`에서 데이터 가져와 렌더 (필요 시 `size` prop, 공용 UI는 `@/shared/dashboard/ui`)
   - `index.ts`로 컴포넌트 export
3. **카탈로그 등록** — `widget-catalog.tsx`에 `{ layout, title, render }` 추가 → `WidgetId`에 자동 포함
4. **템플릿 연결** — 노출할 템플릿의 `template-widgets.ts` 배열에 id 추가

**③ 새 템플릿(purpose) 추가**
1. `shared/dashboard/model/template.ts`의 `WorkspacePurpose`에 이름 추가
2. `TEMPLATE_WIDGETS` 누락 키 컴파일 에러 → 엔트리 추가하면 끝 (라우트·뷰·페이지 추가 불필요)

## 안전장치

- **컴파일**: 카탈로그 밖 위젯 id / 템플릿 키 누락 → 타입 에러가 할 일을 알려줌.
- **런타임**: 추가 시 `id in WIDGET_CATALOG` 가드, 렌더 시 카탈로그에 없는 layout 항목 제외 (DB에 옛 위젯이 남아도 안전).

## 남은 작업 (후속 PR)

- `getWorkspace` / `getDashboardLayout` / `saveDashboardLayout` **Supabase 연동** (현재 stub·mock). 저장 시 세션 `user_id` 주입 + 드래그 debounce.
- 조회를 RSC에서 수행해 `initialLayout` 주입 → 마운트 재조회/깜빡임 제거.
- 페이지의 임시 하드코딩 `purpose={'side-project'}` → 실제 `getWorkspace().purpose`로 복구.
- (선택) `TEMPLATE_WIDGETS` 밖 위젯을 렌더에서도 제외할지 결정 (현재는 추가 메뉴만 스코프).

## 확인

- `tsc --noEmit` 통과, `eslint` 통과
- 목 저장분으로 복원 확인 — 저장엔 minW/minH가 없어도 리사이즈 시 카탈로그 제약이 걸림(데이터/UI 분리 검증)
- 빈 시작 → 편집 모드 위젯 추가 → 드래그/리사이즈/삭제 동작 확인
