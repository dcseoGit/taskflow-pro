# 04. 코딩 컨벤션

## 공통

- 식별자(변수명, 함수명, 파일명, 클래스명)는 **영어**로 작성한다.
- 주석은 한국어로 작성한다 (단, 코드 자체로 의미가 명확하면 생략).
- 비밀값(API 키, 토큰, 비밀번호)은 코드에 직접 쓰지 않는다.

## Frontend (TypeScript / React)

### 네이밍

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 | PascalCase | `TaskCard.tsx` |
| 훅 | camelCase, `use` 접두사 | `useTaskList.ts` |
| 유틸 함수 | camelCase | `formatDate.ts` |
| 상수 | UPPER_SNAKE_CASE | `MAX_TASK_COUNT` |
| 타입/인터페이스 | PascalCase | `TaskItem`, `ApiResponse` |
| CSS 클래스 | Tailwind 유틸리티 클래스 직접 사용 |  |

### 파일 구조

- 컴포넌트 파일은 `컴포넌트명/index.tsx` 또는 `컴포넌트명.tsx` 형식.
- 하나의 파일에 하나의 컴포넌트만 export한다.

### 기타

- `any` 타입 사용 금지. 불가피한 경우 `// eslint-disable-next-line` 주석과 이유를 명시한다.
- Props는 인터페이스로 정의한다 (`interface TaskCardProps`).

## Backend (Python / FastAPI)

### 네이밍

| 대상 | 규칙 | 예시 |
|------|------|------|
| 변수·함수 | snake_case | `get_task_by_id` |
| 클래스 | PascalCase | `TaskService` |
| 상수 | UPPER_SNAKE_CASE | `ACCESS_TOKEN_EXPIRE` |
| 파일 | snake_case | `task_service.py` |

### API

- 엔드포인트는 복수형 명사 사용: `/tasks`, `/projects`
- HTTP 메서드 규칙: `GET` 조회, `POST` 생성, `PATCH` 부분 수정, `DELETE` 삭제
- 응답은 항상 Pydantic 스키마를 통해 직렬화한다.

### 기타

- 함수는 단일 책임 원칙을 따른다.
- `services/`에서 DB 직접 접근 금지 — 반드시 `models/`를 통한다.
- 타입 힌트를 모든 함수 인자·반환값에 명시한다.

## Git 커밋 메시지

```
<type>: <subject>

type 목록:
  feat     새 기능
  fix      버그 수정
  refactor 리팩터링 (기능 변경 없음)
  docs     문서 수정
  test     테스트 추가·수정
  chore    빌드·설정 변경
```

예시: `feat: 태스크 상태 변경 API 추가`
