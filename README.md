# Syncly

> 팀 상황에 맞는 템플릿을 기반으로 필요한 협업 컴포넌트를 직접 배치하고 조립하는 **상황 맞춤형 협업 워크스페이스**

Slack · Notion · Jira 같은 기존 협업툴은 강력하지만, 협업툴에 익숙하지 않은 소규모 팀에게는 초기 세팅과 학습이 부담입니다. Syncly는 **팀플 / 프로젝트 / 매장 운영** 같은 목적을 선택하면 필요한 기능과 화면이 자동으로 구성되는 가벼운 진입형 협업툴을 목표로 합니다.

## 핵심 컨셉

처음부터 워크스페이스 구조를 직접 설계하지 않아도, 목적별 템플릿을 선택하면 공지·업무·일정·회의록·자료·채팅을 **한 공간에서** 바로 관리할 수 있습니다.

| 기존 협업툴                  | Syncly                      |
| ---------------------------- | --------------------------- |
| 사용자가 직접 구조를 설계    | 목적별 템플릿으로 자동 구성 |
| 기능이 많아 처음 쓰기 어려움 | 필요한 기능만 정리된 화면   |
| 여러 툴을 조합해야 함        | 한 공간에서 모든 협업       |

## 타겟 사용자

- **대학생 팀플** — 역할분담, 마감일, 회의록, 자료실
- **사이드 프로젝트 팀** — 업무 관리, 회의록, 자료, 진행률 차트
- **소규모 매장 운영** — 공지, 캘린더, 체크리스트, 자료실
- **스터디 / 동아리** — 일정, 공지, 자료실, 역할 분담

## 주요 기능 (MVP)

| 기능              | 설명                                                   |
| ----------------- | ------------------------------------------------------ |
| 로그인            | GitHub 소셜 로그인, 프로필 설정                        |
| 템플릿 선택       | 팀플 / 프로젝트 / 매장 운영 템플릿                     |
| 워크스페이스 생성 | 템플릿 기반 자동 구성, 생성자 = 관리자                 |
| 프로젝트 관리     | 업무 생성, 담당자 지정, 상태(대기/진행중/완료), 마감일 |
| 캘린더            | 일정·마감일·회의 등록, 월간/주간 확인                  |
| 공지              | 작성·수정·삭제, 중요 공지 고정                         |
| 업무 회의록       | 회의 내용·참석자·결정사항·후속 업무 기록               |
| 자료실            | 파일 업로드, 링크 저장, 자료 목록 관리                 |
| 채팅              | 워크스페이스 멤버 간 메시지                            |
| 차트표            | 전체/완료 업무 개수, 진행률, 담당자별 통계             |
| 초대              | 초대 링크 생성, 멤버 목록 및 역할 관리                 |

자세한 내용은 PRD 문서를 참고하세요.

## 기술 스택

| 영역            | 사용 기술                                                                                                |
| --------------- | -------------------------------------------------------------------------------------------------------- |
| 프레임워크      | [Next.js 16](https://nextjs.org) (App Router), React 19, TypeScript                                      |
| 백엔드 / 인증   | [Supabase](https://supabase.com) (`@supabase/ssr`, `supabase-js`)                                        |
| 서버 상태       | [TanStack Query](https://tanstack.com/query)                                                             |
| 클라이언트 상태 | [Zustand](https://zustand-demo.pmnd.rs)                                                                  |
| UI              | [Tailwind CSS v4](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com), Radix UI, lucide-react   |
| 폼 / 검증       | [react-hook-form](https://react-hook-form.com), [zod](https://zod.dev)                                   |
| 레이아웃        | [react-grid-layout](https://github.com/react-grid-layout/react-grid-layout) (워크스페이스 컴포넌트 배치) |
| 날짜            | [date-fns](https://date-fns.org)                                                                         |

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

루트에 `.env.local` 파일을 만들고 Supabase 프로젝트 정보를 입력합니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

### 3. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인합니다.

## 스크립트

| 명령어          | 설명               |
| --------------- | ------------------ |
| `npm run dev`   | 개발 서버 실행     |
| `npm run build` | 프로덕션 빌드      |
| `npm run start` | 프로덕션 서버 실행 |
| `npm run lint`  | ESLint 검사        |

## 프로젝트 구조

```
src/
├── app/              # Next.js App Router (페이지, 레이아웃)
├── components/
│   └── ui/           # shadcn/ui 컴포넌트
└── lib/
    ├── client.ts     # Supabase 브라우저 클라이언트
    ├── server.ts     # Supabase 서버 클라이언트
    ├── middleware.ts # Supabase 세션 미들웨어
    └── utils.ts      # 공용 유틸 (cn 등)
```

## 향후 확장 (MVP 이후)

템플릿 공유 커뮤니티 · AI 회의록 정리 · 대화 → 업무 변환 · 외부 링크 연동(Figma/GitHub) · 알림 기능 · 모바일 앱
