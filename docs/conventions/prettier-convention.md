# Prettier Convention

## 1. 목적

Prettier는 팀원 간 코드 포맷 차이를 줄이고, 리뷰에서 스타일 관련 논의를 줄이기 위해 사용합니다.

코드 스타일은 개인 취향이 아니라 팀 규칙을 따릅니다.

PR 전에는 반드시 포맷 검사를 통과해야 합니다.

## 2. Prettier 설정안

팀 합의 후 `.prettierrc`에 아래 설정을 적용합니다.

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always",
  "endOfLine": "lf",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

## 3. 규칙 설명

| 옵션 | 값 | 설명 |
| --- | --- | --- |
| `semi` | `true` | 문장 끝에 세미콜론을 사용합니다. |
| `singleQuote` | `true` | 문자열은 작은따옴표를 사용합니다. |
| `trailingComma` | `all` | 가능한 곳에는 trailing comma를 사용합니다. |
| `printWidth` | `100` | 한 줄 최대 길이는 100자로 제한합니다. |
| `tabWidth` | `2` | 들여쓰기는 2칸을 사용합니다. |
| `arrowParens` | `always` | 화살표 함수 인자는 항상 괄호를 사용합니다. |
| `endOfLine` | `lf` | 운영체제별 줄바꿈 차이를 방지하기 위해 LF로 통일합니다. |
| `plugins` | `prettier-plugin-tailwindcss` | Tailwind class를 자동 정렬합니다. |

## 4. Line Ending

모든 파일의 줄바꿈은 LF를 사용합니다.

```json
{
  "endOfLine": "lf"
}
```

Windows / macOS 환경 차이로 인한 불필요한 diff를 방지하기 위해 CRLF가 아닌 LF로 통일합니다.

## 5. Prettier Ignore

팀 합의 후 `.prettierignore`에 아래 항목을 설정합니다.

```txt
node_modules
.next
out
build
coverage
public
package-lock.json
next-env.d.ts
```

## 6. 사용 명령어

포맷을 자동으로 적용할 때:

```bash
npm run format
```

포맷이 맞는지 검사할 때:

```bash
npm run format:check
```

PR 전 전체 검사를 실행할 때:

```bash
npm run check
```

## 7. package.json scripts 설정안

팀 합의 후 `package.json`에 아래 scripts를 추가합니다.

```json
{
  "scripts": {
    "lint": "eslint",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "check": "npm run lint && npm run typecheck && npm run format:check"
  }
}
```

## 8. 운영 규칙

- PR 전 `npm run check`를 실행합니다.
- 포맷이 맞지 않으면 `npm run format`으로 정리한 뒤 커밋합니다.
- 포맷 관련 리뷰 코멘트는 Prettier 규칙을 기준으로 판단합니다.
- 개인 에디터 설정보다 프로젝트 Prettier 설정을 우선합니다.
- Tailwind class 순서는 직접 정렬하지 않고 `prettier-plugin-tailwindcss`에 맡깁니다.

## 9. VS Code 권장 설정

팀원들이 동일한 포맷 경험을 갖도록 VS Code에서는 아래 설정을 권장합니다.

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true
}
```

단, `formatOnSave`는 개인 선호에 따라 끌 수 있지만, PR 전에는 반드시 `npm run check`를 통과해야 합니다.
