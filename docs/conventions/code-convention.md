# Code Convention

Syncly의 코드 구조, 네이밍, 품질 기준을 통일하기 위한 문서입니다.

## 1. Naming Convention

| 대상                | 규칙                                | 예시                             |
| ------------------- | ----------------------------------- | -------------------------------- |
| 변수                | camelCase                           | `userList`, `activeIndex`        |
| 함수                | camelCase, 동사로 시작              | `fetchUser`, `createWorkspace`   |
| boolean 변수        | `is`, `has`, `can`, `should` 접두사 | `isOpen`, `hasPermission`        |
| 상수                | UPPER_SNAKE_CASE                    | `MAX_RETRY_COUNT`                |
| 객체/배열 상수      | camelCase                           | `moduleTypeMap`                  |
| 타입/인터페이스     | PascalCase                          | `WorkspaceModule`, `UserProfile` |
| React 컴포넌트      | PascalCase                          | `WorkspaceCard`                  |
| 커스텀 훅           | `use` 접두사 + camelCase            | `useWorkspaceModules`            |
| 이벤트 핸들러       | `handle` 접두사                     | `handleSubmit`                   |
| 이벤트 핸들러 props | `on` 접두사                         | `onSubmit`, `onClose`            |
| 컴포넌트 파일       | PascalCase                          | `WorkspaceCard.tsx`              |
| 유틸/훅/타입 파일   | kebab-case                          | `date-format.ts`, `use-auth.ts`  |
| 폴더명              | kebab-case                          | `workspace-module`               |
| URL 경로            | kebab-case                          | `/workspace-settings`            |

## 2. TypeScript Convention

- `any` 사용을 지양합니다.
- 외부 데이터는 필요한 경우 런타임 검증을 거칩니다.
- `unknown`을 사용한 뒤 타입 가드로 좁힙니다.
- export 함수는 반환 타입을 명시합니다.
- 객체 구조를 확장할 가능성이 있으면 `interface`를 사용합니다.
- 유니온, 유틸리티 타입은 `type`을 사용합니다.
- `IUser`, `TUser` 같은 접두사는 사용하지 않습니다.

```ts
type WorkspacePurpose = 'team_project' | 'side_project' | 'store' | 'study' | 'custom';

interface WorkspaceModule {
  id: string;
  moduleType: string;
  sortOrder: number;
}
```

## 3. React / Next.js Convention

- `React.FC`는 사용하지 않습니다.
- Props 타입은 컴포넌트 바로 위에 선언합니다.
- 컴포넌트명과 파일명은 일치시킵니다.
- 기본은 Server Component로 작성합니다.
- 상태, 이벤트, 브라우저 API가 필요한 경우에만 `'use client'`를 사용합니다.
- `'use client'`는 가능한 가장 하위 컴포넌트에 선언합니다.

```tsx
interface WorkspaceCardProps {
  name: string;
  onSelect: () => void;
}

export default function WorkspaceCard({ name, onSelect }: WorkspaceCardProps) {
  return <button onClick={onSelect}>{name}</button>;
}
```

## 4. FSD Structure

프로젝트 구조는 FSD(Feature-Sliced Design)를 기준으로 확장합니다.

```txt
src/
├── app/          # 앱 초기화, 라우팅, 전역 provider, 전역 스타일
├── views/        # 페이지 단위 조합
├── widgets/      # 페이지를 구성하는 독립적인 UI 블록
├── features/     # 사용자 행동 중심 기능
├── entities/     # 비즈니스 엔티티
├── shared/       # 공통 코드
└── processes/    # 여러 페이지에 걸친 프로세스, 필요한 경우에만 사용
```

### Layer Import Rule

상위 layer는 하위 layer만 import할 수 있습니다.

```txt
app
↓
views
↓
widgets
↓
features
↓
entities
↓
shared
```

허용 예시:

```ts
import { Header } from '@/widgets/header';
import { LoginForm } from '@/features/login';
import { userApi } from '@/entities/user';
import { Button } from '@/shared/ui/button';
```

금지 예시:

```ts
// shared 내부에서 features를 import하는 경우 금지
import { loginApi } from '@/features/login';

// entities 내부에서 widgets를 import하는 경우 금지
import { Header } from '@/widgets/header';
```

## 5. Public API Rule

각 slice는 외부에 노출할 코드를 `index.ts`를 통해 export합니다.

```ts
// src/features/login/index.ts
export { LoginForm } from './ui/LoginForm';
export { useLogin } from './model/use-login';
```

외부에서는 slice 내부 경로를 직접 import하지 않습니다.

```ts
// Good
import { LoginForm } from '@/features/login';

// Bad
import { LoginForm } from '@/features/login/ui/LoginForm';
```

## 6. Shared UI Rule

공통으로 재사용되는 UI 컴포넌트는 `shared/ui`에 위치시킵니다.

```txt
src/shared/ui/button
src/shared/ui/input
src/shared/ui/modal
src/shared/ui/avatar
```

운영 규칙:

- 2개 이상의 feature에서 사용되는 UI는 `shared/ui`로 분리합니다.
- 특정 기능에만 종속된 UI는 해당 feature의 `ui`에 둡니다.
- 동일한 역할의 버튼, 입력창, 모달을 각 feature에서 중복 구현하지 않습니다.

## 7. Code Quality Convention

PR 생성 전 아래 항목을 확인합니다.

- `console.log`는 커밋하지 않습니다.
- 사용하지 않는 import, variable은 제거합니다.
- `any` 사용을 지양합니다.
- React Hooks 규칙을 준수합니다.
- FSD layer import 규칙을 준수합니다.
- 불필요한 중복 컴포넌트 생성을 피합니다.
- 공통 UI는 가능한 `shared/ui`에서 재사용합니다.

## 8. ESLint 적용 예정 규칙

아래 규칙은 팀 합의 후 ESLint를 통해 자동 검사할 예정입니다.

| 규칙                          | 목적                                         |
| ----------------------------- | -------------------------------------------- |
| `console.log` 금지            | 디버깅 코드가 배포 코드에 포함되는 것을 방지 |
| unused import / variable 금지 | 불필요한 코드 제거                           |
| `any` 사용 제한               | 타입 안정성 유지                             |
| React Hooks 규칙 강제         | Hooks 오사용 방지                            |
| FSD layer import 규칙 강제    | 프로젝트 구조 일관성 유지                    |
| 공통 UI 중복 구현 제한        | UI 컴포넌트 재사용성 유지                    |

## 9. Design Token Rule

디자인 토큰이 확정되면 아래 규칙을 적용합니다.

- 직접 색상값을 사용하지 않습니다.
- 직접 spacing, radius 값을 남발하지 않습니다.
- Tailwind arbitrary value 사용을 제한합니다.
- 색상, 간격, radius, shadow는 정의된 토큰을 우선 사용합니다.

금지 예시:

```tsx
<div className="bg-[#ffffff] text-[#111111]" />
<div style={{ color: '#111111' }} />
<div className="mt-[13px]" />
```

권장 예시:

```tsx
<div className="bg-background text-foreground" />
<Button variant="primary" />
```
