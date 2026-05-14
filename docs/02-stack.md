# 02. 기술 스택

## Frontend

| 항목 | 선택 | 버전 |
|------|------|------|
| 프레임워크 | React | ^18 |
| 빌드 도구 | Vite | ^5 |
| 언어 | TypeScript | ^5 |
| 상태 관리 | Zustand | ^4 |
| 서버 상태 | TanStack Query | ^5 |
| 스타일 | Tailwind CSS | ^3 |
| 라우팅 | React Router | ^6 |
| HTTP 클라이언트 | Axios | ^1 |
| 폼 검증 | React Hook Form + Zod | latest |

## Backend

| 항목 | 선택 | 버전 |
|------|------|------|
| 언어 | Python | ^3.11 |
| 프레임워크 | FastAPI | ^0.110 |
| ASGI 서버 | Uvicorn | ^0.29 |
| ODM | Beanie (Motor 기반) | ^1.25 |
| 인증 | python-jose + passlib | latest |
| 환경변수 | pydantic-settings | ^2 |
| 테스트 | pytest + httpx | latest |

## Database

| 항목 | 선택 | 버전 |
|------|------|------|
| DB | MongoDB | ^7 |
| 드라이버 | Motor (async) | ^3 |

## 인프라 / 도구

| 항목 | 선택 |
|------|------|
| 컨테이너 | Docker + Docker Compose |
| 패키지 관리 (BE) | pip + requirements.txt |
| 패키지 관리 (FE) | npm |
| 코드 품질 (FE) | ESLint + Prettier |
| 코드 품질 (BE) | Ruff + Black |

## 버전 고정 원칙

- 의존성은 `requirements.txt` 및 `package.json`에 버전을 명시한다.
- 사전 협의 없이 버전을 올리지 않는다.
