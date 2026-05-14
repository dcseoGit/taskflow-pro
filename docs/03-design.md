# 03. Design — 기술 결정 8가지

## 읽는 법

각 결정은 **선택 → 대안 → 근거 → 트레이드오프** 순으로 기술한다.  
"왜 이걸 썼지?"라는 질문이 생기면 이 파일을 먼저 확인한다.

---

## 기술 결정 표

| # | 결정 항목 | 선택 | 대안 | 근거 | 트레이드오프 |
|---|-----------|------|------|------|--------------|
| 1 | 백엔드 프레임워크 | **FastAPI** | Django, Express | 타입 힌트 기반 자동 검증·Swagger 자동 생성·비동기 지원. 소규모 REST API에 필요한 것만 갖춤 | Django 대비 ORM·Admin·Auth 직접 구현 필요. Express 대비 Python 생태계로 제한 |
| 2 | 프론트엔드 | **Vanilla JS + Tailwind CDN** | React, Vue | 빌드 도구 없이 브라우저에서 즉시 실행. MVP 규모에서 프레임워크 오버헤드 없음 | 컴포넌트 재사용·상태 관리가 복잡해지면 한계 도달. 확장 시 프레임워크 전환 필요 |
| 3 | 데이터베이스 | **SQLite → PostgreSQL** (SQLAlchemy) | MongoDB, Firebase | 개발: 파일 DB로 설치 없이 시작. 운영: 동일 ORM 코드로 PostgreSQL 교체 가능 | SQLite는 동시 쓰기 약함. 전환 전까지 다중 사용자 시나리오 테스트 불가 |
| 4 | CSS 방식 | **Tailwind only** | styled-components, CSS Modules | 유틸리티 클래스로 HTML에서 스타일 의도 즉시 파악. CDN 방식으로 빌드 불필요. `styled-components` 금지 — JS 번들에 CSS 혼입 시 디버깅 복잡도 증가 | 클래스 나열로 마크업 길어짐. Tailwind 클래스 숙지 필요 |
| 5 | 실시간 업데이트 | **폴링 3초** (MVP) → WebSocket (확장) | WebSocket, SSE | MVP에서 WebSocket 서버 구현·연결 관리 복잡도 제거. 3초 폴링으로 팀 규모(10명)에서 충분 | 불필요한 요청 발생. 확장 단계에서 폴링→WebSocket 전환 비용 발생 |
| 6 | 상태 관리 | **모듈 변수 + DOM 직접 갱신** | Redux, Zustand, Pinia | 프레임워크 없는 Vanilla JS 환경에서 외부 상태 라이브러리 도입은 오버엔지니어링. `tasks` 배열 1개가 단일 진실 공급원 | 화면이 늘어날수록 수동 DOM 동기화 누락 위험. 확장 시 상태 관리 라이브러리 도입 신호 | 
| 7 | 디자인 시스템 | **macOS UI 톤** | Material Design, Ant Design | 외부 컴포넌트 라이브러리 없이 Tailwind 토큰만으로 일관된 톤 유지. 의존성 최소화 | Material·Ant 대비 기성 컴포넌트 없어 직접 구현 필요 |
| 8 | 테마 | **라이트/다크 토글** (`localStorage`) | CSS only, 시스템 설정만 | 사용자 명시적 선택 우선. 초기값은 `prefers-color-scheme`으로 시스템 설정 존중. 이후 `localStorage('theme')` 으로 유지 | 세션 간 동기화 불필요(단일 기기). SSR 없으므로 깜빡임(FOUC) 방지는 `<head>` 인라인 스크립트로 처리 |

---

## 디자인 토큰

Tailwind 클래스로 표현하며, 커스텀 CSS 작성 전 아래 토큰을 먼저 사용한다.

| 토큰 | Tailwind 클래스 | 용도 |
|------|-----------------|------|
| 모서리 | `rounded-xl` | 카드·모달·버튼 |
| 그림자 | `shadow-lg` | 카드·모달 부상 표현 |
| 배경 블러 | `backdrop-blur-md` + `bg-white/70` (라이트) / `bg-gray-900/70` (다크) | 반투명 카드 |
| 폰트 | `font-sans` → `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` | 전체 |
| 터치 타깃 | `min-h-[44px] min-w-[44px]` | 버튼·아이콘 버튼 (모바일) |
| 전환 | `transition-all duration-200 ease-in-out` | 호버·모달·테마 |

---

## 테마 구현 규칙

```
초기값 결정 순서:
  1. localStorage('theme') 값이 있으면 사용
  2. 없으면 window.matchMedia('(prefers-color-scheme: dark)') 확인
  3. 그것도 없으면 라이트 테마 기본값

적용 방식:
  <html class="dark"> 토글 → Tailwind dark: 변형 활성화
  변경 시 localStorage.setItem('theme', 'dark' | 'light') 저장

FOUC 방지:
  <head> 최상단 인라인 <script>로 테마 클래스 즉시 적용 (외부 JS 로드 전)
```

---

## 의존성 추가 정책

> **새 패키지·라이브러리는 이 파일에 사유를 먼저 기록한 후에만 도입할 수 있다.**

도입 전 아래 항목을 이 파일에 추가하고 팀(또는 Claude)의 확인을 받는다.

| 항목 | 내용 |
|------|------|
| 패키지명 | — |
| 도입 이유 | 기존 코드로 해결 불가한 이유 |
| 대안 검토 | 직접 구현 / 다른 패키지와 비교 |
| 영향 범위 | 어떤 파일·레이어에 추가되는가 |
| 제거 가능성 | 나중에 제거하기 얼마나 쉬운가 |

**원칙**: 의존성은 추가보다 제거가 어렵다. 확신 없으면 직접 구현을 먼저 시도한다.
